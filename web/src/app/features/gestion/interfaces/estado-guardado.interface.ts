/** Resultado de un guardado, para mostrarlo junto a lo que se ha guardado. */
export interface EstadoGuardado {
  readonly tipo: 'ok' | 'error';
  readonly mensaje: string;
}
