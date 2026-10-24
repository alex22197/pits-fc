/** Un gol o una tarjeta en la cronología del partido. */
export interface Incidencia {
  readonly tipo: 'gol' | 'amarilla' | 'roja';
  readonly minuto: number | null;
  readonly nuestro: boolean;
  /** Nombre corto del jugador, o el nombre del rival si el gol es suyo. */
  readonly quien: string;
  /** Marcador tras el gol, p. ej. «2-1»; `null` en las tarjetas. */
  readonly marcador: string | null;
}
