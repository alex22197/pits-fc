import type { GolActa } from './gol-acta.interface';
import type { TarjetaActa } from './tarjeta-acta.interface';

/** Lo que los gestores apuntan de un partido nuestro: sus goles y sus tarjetas. */
export interface ActaPartido {
  readonly goles: readonly GolActa[];
  readonly tarjetas: readonly TarjetaActa[];
}
