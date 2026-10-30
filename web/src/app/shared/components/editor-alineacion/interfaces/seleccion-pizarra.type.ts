import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';

/** Lo que se ha tocado en la pizarra y espera su pareja: un jugador sin sitio o un hueco sin jugador. */
export type SeleccionPizarra =
  | { readonly tipo: 'jugador'; readonly jugadorId: string }
  | { readonly tipo: 'puesto'; readonly puesto: PuestoAlineacion };
