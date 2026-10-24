import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Marcador } from '@data-access/partidos/interfaces/marcador.interface';

/** Un gol de uno de nuestros partidos, nuestro o del rival. */
export interface GolEquipo {
  readonly id: string;
  readonly partidoId: string;
  readonly jornadaNumero: number;
  /** `true` si lo marcamos nosotros. */
  readonly esNuestro: boolean;
  /** Solo los nuestros tienen autor (ADR 0004). */
  readonly jugador: Jugador | null;
  readonly minuto: number | null;
  readonly marcador: Marcador;
}
