import type { PosicionJugador } from './interfaces/posicion-jugador.type';

const ETIQUETAS: Readonly<Record<PosicionJugador, string>> = {
  portero: 'Portero',
  defensa: 'Defensa',
  centrocampista: 'Centrocampista',
  delantero: 'Delantero',
};

/** Posición de un jugador tal como se muestra; vacío si no está definida. */
export function etiquetaPosicion(posicion: PosicionJugador | null): string {
  return posicion ? ETIQUETAS[posicion] : '';
}
