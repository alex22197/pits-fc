import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Un jugador que figura en el acta de un partido nuestro. */
export interface Participante {
  readonly jugador: Jugador;
  readonly titular: boolean;
  /** Dorsal que llevó ese día, si el acta lo recoge. */
  readonly dorsal: number | null;
}
