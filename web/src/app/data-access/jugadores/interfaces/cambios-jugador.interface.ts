import type { PosicionJugador } from './posicion-jugador.type';

/** Lo que un gestor puede cambiar de un jugador. */
export interface CambiosJugador {
  readonly nombreMostrar: string;
  readonly dorsal: number | null;
  readonly posicion: PosicionJugador | null;
  readonly activo: boolean;
}
