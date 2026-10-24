import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contexto, JornadaBd } from '../interfaces/contexto.interface.ts';
import type { PartidoJornada } from '../interfaces/partido-jornada.interface.ts';
import type { ResumenImportacion } from '../interfaces/resumen-importacion.interface.ts';
import { instanteEnMadrid } from '../utils/fechas.ts';
import { exigir } from './base-de-datos.ts';
import { estadoDePartido } from './estado-partido.ts';
import { idEquipo } from './guardar-calendario.ts';

/**
 * Lleva a `partido` lo que solo trae la página de jornada: fecha y hora reales y campo. El
 * partido se localiza por su código de acta y, si no lo tiene, por jornada y equipos.
 */
export async function guardarDetallesJornada(
  db: SupabaseClient,
  contexto: Contexto,
  jornada: JornadaBd,
  hoy: string,
  partidos: readonly PartidoJornada[],
  resumen: ResumenImportacion,
): Promise<void> {
  for (const partido of partidos) {
    const existente = (partido.codActa && contexto.partidos.find((p) =>
      p.cod_acta === partido.codActa
    )) ||
      contexto.partidos.find(
        (p) =>
          p.jornada_id === jornada.id &&
          p.local_id === idEquipo(contexto, partido.local) &&
          p.visitante_id === idEquipo(contexto, partido.visitante),
      );
    if (!existente) {
      resumen.avisos.push(
        `Partido de la jornada sin sitio: ${partido.local} - ${partido.visitante}.`,
      );
      continue;
    }
    const fechaHora = partido.fecha && partido.hora
      ? instanteEnMadrid(partido.fecha, partido.hora)
      : null;
    const jugado = partido.golesLocal !== null && partido.golesVisitante !== null;
    const estado = estadoDePartido({
      jugado,
      fechaHora,
      fechaPrevista: jornada.fecha_prevista,
      hoy,
      estadoActual: existente.estado,
    });
    const cambios: Record<string, unknown> = {
      fecha_hora: fechaHora,
      campo: partido.campo,
      estado,
      ...(partido.codActa && !existente.cod_acta ? { cod_acta: partido.codActa } : {}),
      ...(jugado
        ? { goles_local: partido.golesLocal, goles_visitante: partido.golesVisitante }
        : { goles_local: null, goles_visitante: null }),
    };
    exigir(
      await db.from('partido').update(cambios).eq('id', existente.id),
      'No se ha podido guardar el detalle de un partido',
    );
    existente.fecha_hora = fechaHora;
    existente.estado = estado;
    if (partido.codActa && !existente.cod_acta) {
      existente.cod_acta = partido.codActa;
    }
  }
  resumen.jornadasConDetalle += 1;
}
