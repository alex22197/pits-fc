import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Un jugador que figura en el acta de un partido nuestro. */
export interface Participante {
  readonly jugador: Jugador;
  readonly titular: boolean;
  /** Dorsal que llevó ese día, si el acta lo recoge. */
  readonly dorsal: number | null;
  /** Dónde jugó en el 1-2-3-1, si un gestor lo colocó (o venía de la alineación publicada). */
  readonly puesto: PuestoAlineacion | null;
}
