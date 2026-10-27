import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Marcador } from './marcador.interface';

/** Un gol y el marcador que dejó. Los goles rivales no tienen autor (ADR 0004). */
export interface Gol {
  readonly id: string;
  readonly equipoId: string;
  readonly jugador: Jugador | null;
  /** Quien dio el pase, si es un gol nuestro y se apuntó. */
  readonly asistente: Jugador | null;
  readonly minuto: number | null;
  readonly marcador: Marcador;
}
