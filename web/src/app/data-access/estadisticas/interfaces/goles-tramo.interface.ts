/** Goles a favor y en contra en un tramo de minutos del partido. */
export interface GolesTramo {
  /** Etiqueta del tramo, p. ej. «0-10» o «Sin minuto». */
  readonly tramo: string;
  readonly favor: number;
  readonly contra: number;
}
