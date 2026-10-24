import type { Jornada } from './interfaces/jornada.interface';

/**
 * La jornada que toca: la primera con algún partido por jugar cuya fecha prevista no haya
 * pasado más de un día. Si ya no queda ninguna, la última.
 */
export function elegirJornadaActual(jornadas: readonly Jornada[], hoy: string): Jornada | null {
  if (jornadas.length === 0) {
    return null;
  }
  const ayer = restarUnDia(hoy);
  return (
    jornadas.find(
      (jornada) =>
        jornada.fechaPrevista >= ayer &&
        jornada.partidos.some((partido) => partido.estado !== 'jugado'),
    ) ?? jornadas[jornadas.length - 1]
  );
}

function restarUnDia(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia - 1)).toISOString().slice(0, 10);
}
