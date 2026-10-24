import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contexto, PartidoBd } from '../interfaces/contexto.interface.ts';
import type { JornadaCalendario } from '../interfaces/jornada-calendario.interface.ts';
import type { PartidoCalendario } from '../interfaces/partido-calendario.interface.ts';
import type { ResumenImportacion } from '../interfaces/resumen-importacion.interface.ts';
import { exigir } from './base-de-datos.ts';

/**
 * Lleva a `partido` lo que dice el calendario: código de acta, marcador y estado. Un partido
 * que no exista se crea; un equipo o jornada desconocidos se anotan como aviso y se saltan.
 */
export async function guardarCalendario(
  db: SupabaseClient,
  contexto: Contexto,
  jornadas: readonly JornadaCalendario[],
  resumen: ResumenImportacion,
): Promise<void> {
  for (const jornada of jornadas) {
    const jornadaBd = contexto.jornadas.find((candidata) => candidata.numero === jornada.numero);
    if (!jornadaBd) {
      resumen.avisos.push(
        `La jornada ${jornada.numero} del calendario no existe en la base de datos.`,
      );
      continue;
    }
    await actualizarDescanso(db, contexto, jornadaBd.id, jornadaBd.descansa_id, jornada.descansa);
    for (const partido of jornada.partidos) {
      await guardarPartido(db, contexto, jornadaBd.id, partido, resumen);
    }
  }
}

async function actualizarDescanso(
  db: SupabaseClient,
  contexto: Contexto,
  jornadaId: string,
  descansaActual: string | null,
  descansa: string | null,
): Promise<void> {
  const equipo = descansa ? idEquipo(contexto, descansa) : null;
  if (equipo !== descansaActual) {
    exigir(
      await db.from('jornada').update({ descansa_id: equipo }).eq('id', jornadaId),
      'No se ha podido actualizar el descanso',
    );
  }
}

async function guardarPartido(
  db: SupabaseClient,
  contexto: Contexto,
  jornadaId: string,
  partido: PartidoCalendario,
  resumen: ResumenImportacion,
): Promise<void> {
  const localId = idEquipo(contexto, partido.local);
  const visitanteId = idEquipo(contexto, partido.visitante);
  if (!localId || !visitanteId) {
    resumen.avisos.push(
      `Equipo desconocido en el calendario: ${partido.local} - ${partido.visitante}.`,
    );
    return;
  }
  const jugado = partido.golesLocal !== null && partido.golesVisitante !== null;
  const existente = contexto.partidos.find(
    (candidato) =>
      candidato.jornada_id === jornadaId &&
      candidato.local_id === localId &&
      candidato.visitante_id === visitanteId,
  );
  const estado = jugado
    ? 'jugado'
    : existente && existente.estado !== 'jugado'
    ? existente.estado
    : 'programado';
  const cambios = {
    cod_acta: partido.codActa,
    goles_local: jugado ? partido.golesLocal : null,
    goles_visitante: jugado ? partido.golesVisitante : null,
    estado,
  };
  if (existente) {
    exigir(
      await db.from('partido').update(cambios).eq('id', existente.id),
      'No se ha podido actualizar un partido',
    );
    existente.estado = estado;
    existente.cod_acta = partido.codActa;
  } else {
    const creado = exigir(
      await db
        .from('partido')
        .insert({ jornada_id: jornadaId, local_id: localId, visitante_id: visitanteId, ...cambios })
        .select(
          'id, jornada_id, local_id, visitante_id, estado, cod_acta, fecha_hora, acta_importada_en',
        )
        .single(),
      'No se ha podido crear un partido',
    ) as PartidoBd;
    contexto.partidos.push(creado);
    resumen.avisos.push(`Partido nuevo en la jornada: ${partido.local} - ${partido.visitante}.`);
  }
  resumen.partidosActualizados += 1;
}

/** Id de un equipo por su nombre en la federación, o `null` si no se conoce. */
export function idEquipo(contexto: Contexto, nombreFederacion: string): string | null {
  const nombre = nombreFederacion.trim().toUpperCase();
  return (
    contexto.equipos.find((equipo) => equipo.nombre_federacion.trim().toUpperCase() === nombre)
      ?.id ??
      null
  );
}
