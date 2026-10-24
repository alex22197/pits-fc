import type { SupabaseClient } from '@supabase/supabase-js';
import type { Acta, EquipoActa } from '../interfaces/acta.interface.ts';
import type { Contexto, PartidoBd } from '../interfaces/contexto.interface.ts';
import type { ResumenImportacion } from '../interfaces/resumen-importacion.interface.ts';
import { exigir } from './base-de-datos.ts';
import { nombreCorto } from './nombre-corto.ts';

/**
 * Guarda lo que el acta dice de nuestro partido: participaciones, goles (los rivales sin
 * autor) y tarjetas nuestras. Los jugadores se reconocen por `jugador_privado.nombre_federacion`;
 * los que no existan se dan de alta con un nombre corto y se anotan en el resumen.
 */
export async function guardarActa(
  db: SupabaseClient,
  contexto: Contexto,
  partido: PartidoBd,
  acta: Acta,
  resumen: ResumenImportacion,
): Promise<void> {
  const nuestroNombre = contexto.nuestro.nombre_federacion.trim().toUpperCase();
  const somosLocal = acta.local.nombre.trim().toUpperCase() === nuestroNombre;
  const somosVisitante = acta.visitante.nombre.trim().toUpperCase() === nuestroNombre;
  if (!somosLocal && !somosVisitante) {
    throw new Error(`El acta ${partido.cod_acta} no es de nuestro equipo.`);
  }
  const nuestros: EquipoActa = somosLocal ? acta.local : acta.visitante;
  const jugadores = await asegurarJugadores(db, nombresDe(nuestros, acta, somosLocal), resumen);
  await completarDorsales(db, nuestros, jugadores);

  await reemplazar(db, 'participacion', partido.id, [
    ...nuestros.titulares.map((jugador) => ({
      partido_id: partido.id,
      jugador_id: jugadores.get(clave(jugador.nombre)),
      titular: true,
      dorsal: jugador.dorsal,
    })),
    ...nuestros.suplentes.map((jugador) => ({
      partido_id: partido.id,
      jugador_id: jugadores.get(clave(jugador.nombre)),
      titular: false,
      dorsal: jugador.dorsal,
    })),
  ]);

  let anteriorLocal = 0;
  await reemplazar(
    db,
    'gol',
    partido.id,
    acta.goles.map((gol) => {
      const deLocal = gol.marcadorLocal > anteriorLocal;
      anteriorLocal = gol.marcadorLocal;
      const nuestro = deLocal === somosLocal;
      return {
        partido_id: partido.id,
        equipo_id: deLocal ? partido.local_id : partido.visitante_id,
        jugador_id: nuestro ? (jugadores.get(clave(gol.nombre)) ?? null) : null,
        minuto: gol.minuto,
        marcador_local: gol.marcadorLocal,
        marcador_visitante: gol.marcadorVisitante,
      };
    }),
  );

  await reemplazar(
    db,
    'tarjeta',
    partido.id,
    nuestros.tarjetas.map((tarjeta) => ({
      partido_id: partido.id,
      jugador_id: jugadores.get(clave(tarjeta.nombre)),
      tipo: tarjeta.tipo,
      minuto: tarjeta.minuto,
    })),
  );

  const jugado = acta.golesLocal !== null && acta.golesVisitante !== null;
  exigir(
    await db
      .from('partido')
      .update({
        acta_importada_en: new Date().toISOString(),
        ...(jugado
          ? { estado: 'jugado', goles_local: acta.golesLocal, goles_visitante: acta.golesVisitante }
          : {}),
      })
      .eq('id', partido.id),
    'No se ha podido marcar el acta como importada',
  );
  partido.acta_importada_en = new Date().toISOString();
  resumen.actasImportadas += 1;
}

/** Nombres de la federación de los nuestros que aparecen en el acta, sin repetir. */
function nombresDe(nuestros: EquipoActa, acta: Acta, somosLocal: boolean): string[] {
  let anteriorLocal = 0;
  const golesNuestros = acta.goles.filter((gol) => {
    const deLocal = gol.marcadorLocal > anteriorLocal;
    anteriorLocal = gol.marcadorLocal;
    return deLocal === somosLocal;
  });
  const nombres = [
    ...nuestros.titulares.map((j) => j.nombre),
    ...nuestros.suplentes.map((j) => j.nombre),
    ...nuestros.tarjetas.map((t) => t.nombre),
    ...golesNuestros.map((g) => g.nombre),
  ];
  return [...new Set(nombres.map((nombre) => nombre.trim()).filter((nombre) => nombre.length > 0))];
}

/** Mapa nombre de federación → id de jugador, dando de alta a los que falten. */
async function asegurarJugadores(
  db: SupabaseClient,
  nombres: readonly string[],
  resumen: ResumenImportacion,
): Promise<Map<string, string>> {
  const privados = exigir(
    await db.from('jugador_privado').select('jugador_id, nombre_federacion'),
    'No se han podido leer los jugadores',
  ) as { jugador_id: string; nombre_federacion: string | null }[];
  const mapa = new Map(
    privados
      .filter((fila) => fila.nombre_federacion)
      .map((fila) => [clave(fila.nombre_federacion ?? ''), fila.jugador_id]),
  );
  const faltan = nombres.filter((nombre) => !mapa.has(clave(nombre)));
  if (faltan.length === 0) {
    return mapa;
  }
  const existentes = new Set(
    (exigir(
      await db.from('jugador').select('nombre_mostrar'),
      'No se han podido leer los nombres',
    ) as {
      nombre_mostrar: string;
    }[]).map((fila) => fila.nombre_mostrar),
  );
  for (const nombre of faltan) {
    const corto = nombreCorto(nombre, existentes);
    existentes.add(corto);
    const creado = exigir(
      await db.from('jugador').insert({ nombre_mostrar: corto }).select('id').single(),
      'No se ha podido dar de alta un jugador',
    ) as { id: string };
    exigir(
      await db.from('jugador_privado').insert({ jugador_id: creado.id, nombre_federacion: nombre }),
      'No se ha podido guardar el nombre de federación',
    );
    mapa.set(clave(nombre), creado.id);
    resumen.jugadoresNuevos.push(corto);
  }
  return mapa;
}

/**
 * A los jugadores sin dorsal se les pone el que llevaron en el acta. Si ese dorsal ya lo
 * tiene otro jugador activo, se deja vacío: lo decidirá un gestor.
 */
async function completarDorsales(
  db: SupabaseClient,
  nuestros: EquipoActa,
  jugadores: Map<string, string>,
): Promise<void> {
  for (const jugador of [...nuestros.titulares, ...nuestros.suplentes]) {
    const id = jugadores.get(clave(jugador.nombre));
    if (!id || jugador.dorsal === null) {
      continue;
    }
    const { error } = await db
      .from('jugador')
      .update({ dorsal: jugador.dorsal })
      .eq('id', id)
      .is('dorsal', null);
    if (error) {
      console.warn(`No se ha podido asignar el dorsal ${jugador.dorsal}`, error.message);
    }
  }
}

/** Vacía las filas del partido en una tabla y mete las nuevas. */
async function reemplazar(
  db: SupabaseClient,
  tabla: string,
  partidoId: string,
  filas: Record<string, unknown>[],
): Promise<void> {
  exigir(
    await db.from(tabla).delete().eq('partido_id', partidoId),
    `No se ha podido vaciar ${tabla}`,
  );
  if (filas.length > 0) {
    exigir(await db.from(tabla).insert(filas), `No se ha podido guardar ${tabla}`);
  }
}

/** Comparación de nombres sin distinguir mayúsculas, tildes ni espacios de más. */
function clave(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}
