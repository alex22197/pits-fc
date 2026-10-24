import type { Partido } from './interfaces/partido.interface';
import type { ResultadoPartido } from './interfaces/resultado-partido.type';

/** Cómo acabó el partido para nuestro equipo; `null` si no es nuestro o no está jugado. */
export function resultadoParaNosotros(partido: Partido): ResultadoPartido | null {
  if (!partido.esNuestro || !partido.marcador) {
    return null;
  }
  const nuestros = partido.local.esNuestro ? partido.marcador.local : partido.marcador.visitante;
  const suyos = partido.local.esNuestro ? partido.marcador.visitante : partido.marcador.local;
  if (nuestros === suyos) {
    return 'empate';
  }
  return nuestros > suyos ? 'victoria' : 'derrota';
}

/** El último partido nuestro ya jugado, por fecha; `null` si aún no hay ninguno. */
export function elegirUltimoResultado(partidos: readonly Partido[]): Partido | null {
  const jugados = partidos
    .filter((partido) => partido.estado === 'jugado')
    .sort((a, b) => momento(b) - momento(a));
  return jugados[0] ?? null;
}

function momento(partido: Partido): number {
  return (partido.fechaHora ?? new Date(`${partido.fechaPrevista}T12:00:00`)).getTime();
}
