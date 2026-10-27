import type { Partido } from './interfaces/partido.interface';

/** Un partido sigue siendo «el próximo» hasta dos horas después de su hora: dura una. */
const MARGEN_EN_JUEGO_MS = 2 * 60 * 60 * 1000;

/**
 * El partido que toca ahora: el pendiente más cercano cuya fecha no haya pasado. Si no tiene
 * hora fijada, cuenta el final del día previsto en el calendario.
 */
export function elegirProximoPartido(partidos: readonly Partido[], ahora: Date): Partido | null {
  const limite = ahora.getTime() - MARGEN_EN_JUEGO_MS;
  const candidatos = partidos
    .filter((partido) => partido.estado === 'programado' || partido.estado === 'aplazado')
    .map((partido) => ({ partido, momento: momentoDeReferencia(partido).getTime() }))
    .filter(({ momento }) => momento >= limite)
    .sort((a, b) => a.momento - b.momento);
  return candidatos[0]?.partido ?? null;
}

/** Hora del partido o, si no la hay, el final del día previsto (hora local). */
export function momentoDeReferencia(partido: Partido): Date {
  return partido.fechaHora ?? new Date(`${partido.fechaPrevista}T23:59:59`);
}

/** Solo los partidos en los que juega nuestro equipo, en el orden dado. */
export function partidosDeNuestroEquipo(
  jornadas: readonly { partidos: readonly Partido[] }[],
): Partido[] {
  return jornadas.flatMap((jornada) => jornada.partidos.filter((partido) => partido.esNuestro));
}
