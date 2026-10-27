import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';

/**
 * Lo que el gestor ha empezado a decidir en la pizarra y falta por completar: un puesto que
 * espera jugador, o un jugador que espera puesto.
 */
export type SeleccionPendiente =
  | { readonly tipo: 'puesto'; readonly puesto: PuestoAlineacion }
  | { readonly tipo: 'jugador'; readonly jugadorId: string };
