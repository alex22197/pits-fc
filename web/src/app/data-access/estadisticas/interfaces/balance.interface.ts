/** Resultados y goles de un conjunto de partidos (todos, en casa o fuera). */
export interface Balance {
  readonly jugados: number;
  readonly victorias: number;
  readonly empates: number;
  readonly derrotas: number;
  readonly golesFavor: number;
  readonly golesContra: number;
}
