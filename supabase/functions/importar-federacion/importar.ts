import type { SupabaseClient } from '@supabase/supabase-js';
import { cargarContexto, clienteDeServicio, exigir } from './guardado/base-de-datos.ts';
import { guardarActa } from './guardado/guardar-acta.ts';
import { guardarCalendario } from './guardado/guardar-calendario.ts';
import { guardarClasificacion } from './guardado/guardar-clasificacion.ts';
import { guardarDetallesJornada } from './guardado/guardar-jornada.ts';
import type { Contexto } from './interfaces/contexto.interface.ts';
import type { Llamante } from './interfaces/llamante.type.ts';
import {
  type ResumenImportacion,
  resumenVacio,
} from './interfaces/resumen-importacion.interface.ts';
import { analizarActa } from './intranet/analizar-acta.ts';
import { analizarCalendario } from './intranet/analizar-calendario.ts';
import { analizarClasificacion } from './intranet/analizar-clasificacion.ts';
import { analizarJornada } from './intranet/analizar-jornada.ts';
import { ClienteIntranet, codigosDesde } from './intranet/cliente-intranet.ts';
import { urlActa, urlCalendario, urlClasificacion, urlJornada } from './intranet/urls.ts';
import { hoyEnMadrid, sumarDias } from './utils/fechas.ts';

/** Jornadas cuyos detalles (fecha, hora, campo) se refrescan: las de estas semanas. */
const DIAS_ATRAS = 21;
const DIAS_ADELANTE = 28;
/** Las actas de los últimos días se vuelven a leer por si la federación las corrige. */
const DIAS_REVISION_ACTAS = 14;

/**
 * Una importación completa. Cada paso se intenta aunque el anterior falle, y todo queda
 * registrado en `ejecucion_scraper`. Devuelve el resumen y si ha ido bien.
 */
export async function importar(
  llamante: Llamante,
): Promise<{ estado: 'ok' | 'error'; resumen: ResumenImportacion }> {
  const db = clienteDeServicio();
  const resumen = resumenVacio(llamante);
  const ejecucionId = await abrirEjecucion(db, resumen);
  try {
    const contexto = await cargarContexto(db);
    const intranet = ClienteIntranet.desdeEntorno();
    await intranet.iniciarSesion();
    const codigos = codigosDesde(contexto.competicion);

    const hoy = hoyEnMadrid();
    await paso(resumen, 'calendario', async () => {
      const jornadas = analizarCalendario(await intranet.descargar(urlCalendario(codigos)));
      await guardarCalendario(db, contexto, jornadas, hoy, resumen);
    });

    // Fecha, hora y campo: las jornadas de estas semanas y cualquiera con partidos pendientes
    // (aplazados a los que la federación puede poner fecha nueva en cualquier momento).
    const desde = sumarDias(hoy, -DIAS_ATRAS);
    const hasta = sumarDias(hoy, DIAS_ADELANTE);
    for (const jornada of contexto.jornadas) {
      const enVentana = jornada.fecha_prevista >= desde && jornada.fecha_prevista <= hasta;
      const pasadaConPendientes = jornada.fecha_prevista < desde &&
        tienePendientes(contexto, jornada.id);
      if (!enVentana && !pasadaConPendientes) {
        continue;
      }
      await paso(resumen, `jornada ${jornada.numero}`, async () => {
        const partidos = analizarJornada(
          await intranet.descargar(urlJornada(codigos, jornada.numero)),
        );
        await guardarDetallesJornada(db, contexto, jornada, hoy, partidos, resumen);
      });
    }

    await paso(resumen, 'clasificación', async () => {
      const filas = analizarClasificacion(
        await intranet.descargar(urlClasificacion(codigos, jornadaActual(contexto, hoy))),
      );
      await guardarClasificacion(db, contexto, filas, resumen);
    });

    for (const partido of actasPendientes(contexto, hoy)) {
      await paso(resumen, `acta ${partido.cod_acta}`, async () => {
        const acta = analizarActa(await intranet.descargar(urlActa(partido.cod_acta ?? '')));
        await guardarActa(db, contexto, partido, acta, resumen);
      });
    }
  } catch (error) {
    resumen.errores.push(mensajeSeguro(error));
  }
  const estado = resumen.errores.length === 0 ? 'ok' : 'error';
  await cerrarEjecucion(db, ejecucionId, estado, resumen);
  return { estado, resumen };
}

/** Ejecuta un paso y, si falla, lo anota sin tumbar el resto. */
async function paso(
  resumen: ResumenImportacion,
  nombre: string,
  accion: () => Promise<void>,
): Promise<void> {
  try {
    await accion();
  } catch (error) {
    resumen.errores.push(`${nombre}: ${mensajeSeguro(error)}`);
  }
}

/** Si en la jornada queda algún partido sin jugar. */
function tienePendientes(contexto: Contexto, jornadaId: string): boolean {
  return contexto.partidos.some(
    (partido) => partido.jornada_id === jornadaId && partido.estado !== 'jugado',
  );
}

/** La última jornada cuya fecha prevista ya ha llegado (o la primera). */
function jornadaActual(contexto: Contexto, hoy: string): number {
  const pasadas = contexto.jornadas.filter((jornada) => jornada.fecha_prevista <= hoy);
  return pasadas.length > 0 ? pasadas[pasadas.length - 1].numero : 1;
}

/** Nuestros partidos jugados con acta que no se ha importado o que es reciente. */
function actasPendientes(contexto: Contexto, hoy: string): Contexto['partidos'] {
  const limite = sumarDias(hoy, -DIAS_REVISION_ACTAS);
  return contexto.partidos.filter(
    (partido) =>
      partido.estado === 'jugado' &&
      partido.cod_acta !== null &&
      (partido.local_id === contexto.nuestro.id || partido.visitante_id === contexto.nuestro.id) &&
      (partido.acta_importada_en === null || (partido.fecha_hora ?? '') >= limite),
  );
}

async function abrirEjecucion(
  db: SupabaseClient,
  resumen: ResumenImportacion,
): Promise<string | null> {
  const { data, error } = await db
    .from('ejecucion_scraper')
    .insert({ resumen: { llamante: resumen.llamante } })
    .select('id')
    .single();
  if (error) {
    console.error('No se ha podido registrar la ejecución', error.message);
    return null;
  }
  return data.id;
}

async function cerrarEjecucion(
  db: SupabaseClient,
  id: string | null,
  estado: 'ok' | 'error',
  resumen: ResumenImportacion,
): Promise<void> {
  if (!id) {
    return;
  }
  exigir(
    await db
      .from('ejecucion_scraper')
      .update({
        fin: new Date().toISOString(),
        estado,
        resumen,
        error: resumen.errores.length > 0 ? resumen.errores.join('\n') : null,
      })
      .eq('id', id),
    'No se ha podido cerrar la ejecución',
  );
}

/** Mensaje de error sin nada que pueda ser una credencial. */
function mensajeSeguro(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : String(error);
  return mensaje.replace(/NPass=[^&\s]*/g, 'NPass=***').replace(/NUser=[^&\s]*/g, 'NUser=***');
}
