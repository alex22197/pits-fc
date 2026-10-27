import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';
import type { Balance } from './balance.interface';

/** Cómo va la temporada del equipo, calculado a partir de los partidos jugados. */
export interface ResumenEquipo extends Balance {
  readonly diferencia: number;
  /** Puntos que dan nuestros resultados (3, 1, 0), sin sanciones de la federación. */
  readonly puntos: number;
  readonly casa: Balance;
  readonly fuera: Balance;
  /** Últimos cinco resultados, del más antiguo al más reciente. */
  readonly ultimos: readonly ResultadoPartido[];
}
