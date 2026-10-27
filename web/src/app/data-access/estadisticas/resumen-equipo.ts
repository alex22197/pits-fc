import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import { resultadoParaNosotros } from '@data-access/partidos/resultado-partido';
import type { Balance } from './interfaces/balance.interface';
import type { ResumenEquipo } from './interfaces/resumen-equipo.interface';

const PUNTOS = { victoria: 3, empate: 1, derrota: 0 } as const;
const ULTIMOS = 5;

/** Resumen de la temporada a partir de nuestros partidos (solo cuentan los jugados). */
export function calcularResumenEquipo(partidos: readonly Partido[]): ResumenEquipo {
  const jugados = ordenarPorJornada(partidos.filter((p) => p.esNuestro && p.marcador));
  const total = balance(jugados);
  return {
    ...total,
    diferencia: total.golesFavor - total.golesContra,
    puntos: jugados.reduce(
      (suma, partido) => suma + PUNTOS[resultadoParaNosotros(partido) ?? 'derrota'],
      0,
    ),
    casa: balance(jugados.filter((p) => p.local.esNuestro)),
    fuera: balance(jugados.filter((p) => !p.local.esNuestro)),
    ultimos: jugados
      .slice(-ULTIMOS)
      .map((partido) => resultadoParaNosotros(partido))
      .filter((resultado): resultado is NonNullable<typeof resultado> => resultado !== null),
  };
}

/** Victorias, empates, derrotas y goles de un conjunto de partidos nuestros jugados. */
export function balance(partidos: readonly Partido[]): Balance {
  const inicial: Balance = {
    jugados: 0,
    victorias: 0,
    empates: 0,
    derrotas: 0,
    golesFavor: 0,
    golesContra: 0,
  };
  return partidos.reduce((acumulado, partido) => {
    const resultado = resultadoParaNosotros(partido);
    if (!resultado || !partido.marcador) {
      return acumulado;
    }
    const { favor, contra } = golesDesdeNuestroLado(partido);
    return {
      jugados: acumulado.jugados + 1,
      victorias: acumulado.victorias + (resultado === 'victoria' ? 1 : 0),
      empates: acumulado.empates + (resultado === 'empate' ? 1 : 0),
      derrotas: acumulado.derrotas + (resultado === 'derrota' ? 1 : 0),
      golesFavor: acumulado.golesFavor + favor,
      golesContra: acumulado.golesContra + contra,
    };
  }, inicial);
}

/** Goles a favor y en contra de un partido nuestro jugado, estemos de local o de visitante. */
export function golesDesdeNuestroLado(partido: Partido): { favor: number; contra: number } {
  const marcador = partido.marcador ?? { local: 0, visitante: 0 };
  return partido.local.esNuestro
    ? { favor: marcador.local, contra: marcador.visitante }
    : { favor: marcador.visitante, contra: marcador.local };
}

/** Nombre del rival de un partido nuestro. */
export function rivalDe(partido: Partido): string {
  return partido.local.esNuestro ? partido.visitante.nombre : partido.local.nombre;
}

/** Partidos por número de jornada, de la primera a la última. */
export function ordenarPorJornada(partidos: readonly Partido[]): Partido[] {
  return [...partidos].sort((a, b) => a.jornadaNumero - b.jornadaNumero);
}
