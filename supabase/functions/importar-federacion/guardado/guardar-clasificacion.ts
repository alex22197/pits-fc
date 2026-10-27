import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contexto } from '../interfaces/contexto.interface.ts';
import type { FilaClasificacionFederacion } from '../interfaces/fila-clasificacion-federacion.interface.ts';
import type { ResumenImportacion } from '../interfaces/resumen-importacion.interface.ts';
import { exigir } from './base-de-datos.ts';
import { idEquipo } from './guardar-calendario.ts';

/**
 * Sustituye la clasificación de la competición por la que publica la federación. Los equipos
 * se reconocen por su código y, si no lo tienen guardado, por el nombre.
 */
export async function guardarClasificacion(
  db: SupabaseClient,
  contexto: Contexto,
  filas: readonly FilaClasificacionFederacion[],
  resumen: ResumenImportacion,
): Promise<void> {
  const ahora = new Date().toISOString();
  const nuevas = [];
  for (const fila of filas) {
    const equipoId = contexto.equipos.find((equipo) => equipo.cod_equipo === fila.codEquipo)?.id ??
      idEquipo(contexto, fila.nombre);
    if (!equipoId) {
      resumen.avisos.push(
        `Equipo desconocido en la clasificación: ${fila.nombre} (${fila.codEquipo}).`,
      );
      continue;
    }
    nuevas.push({
      competicion_id: contexto.competicion.id,
      equipo_id: equipoId,
      posicion: fila.posicion,
      puntos: fila.puntos,
      jugados: fila.jugados,
      ganados: fila.ganados,
      empatados: fila.empatados,
      perdidos: fila.perdidos,
      goles_favor: fila.golesFavor,
      goles_contra: fila.golesContra,
      sancion: fila.sancion,
      ultimos: fila.ultimos,
      actualizado_en: ahora,
    });
  }
  if (nuevas.length === 0) {
    throw new Error('La clasificación ha llegado vacía; se conserva la anterior.');
  }
  exigir(
    await db.from('clasificacion').delete().eq('competicion_id', contexto.competicion.id),
    'No se ha podido vaciar la clasificación',
  );
  exigir(await db.from('clasificacion').insert(nuevas), 'No se ha podido guardar la clasificación');
  resumen.filasClasificacion = nuevas.length;
}
