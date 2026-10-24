import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import { resultadoParaNosotros } from '@data-access/partidos/resultado-partido';
import type { GolesJornada } from './interfaces/goles-jornada.interface';
import type { PuntoJornada } from './interfaces/punto-jornada.interface';
import { golesDesdeNuestroLado, ordenarPorJornada, rivalDe } from './resumen-equipo';

const PUNTOS = { victoria: 3, empate: 1, derrota: 0 } as const;

/** Puntos acumulados jornada a jornada, solo con los partidos nuestros ya jugados. */
export function puntosPorJornada(partidos: readonly Partido[]): PuntoJornada[] {
  let acumulado = 0;
  const puntos: PuntoJornada[] = [];
  for (const partido of ordenarPorJornada(partidos.filter((p) => p.esNuestro && p.marcador))) {
    const resultado = resultadoParaNosotros(partido);
    if (!resultado) {
      continue;
    }
    acumulado += PUNTOS[resultado];
    const { favor, contra } = golesDesdeNuestroLado(partido);
    puntos.push({
      jornada: partido.jornadaNumero,
      puntos: acumulado,
      resultado,
      rival: rivalDe(partido),
      marcador: `${favor}-${contra}`,
    });
  }
  return puntos;
}

/** Goles a favor y en contra en cada jornada jugada. */
export function golesPorJornada(partidos: readonly Partido[]): GolesJornada[] {
  return ordenarPorJornada(partidos.filter((p) => p.esNuestro && p.marcador)).map((partido) => ({
    jornada: partido.jornadaNumero,
    rival: rivalDe(partido),
    ...golesDesdeNuestroLado(partido),
  }));
}
