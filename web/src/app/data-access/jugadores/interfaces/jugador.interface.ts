import type { PosicionJugador } from './posicion-jugador.type';

/** Un jugador de nuestro equipo, con lo que ve el público (ADR 0004). */
export interface Jugador {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly dorsal: number | null;
  readonly posicion: PosicionJugador | null;
  readonly activo: boolean;
}
