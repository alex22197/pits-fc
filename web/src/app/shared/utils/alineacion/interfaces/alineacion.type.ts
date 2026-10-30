import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Quién ocupa cada puesto del 1-2-3-1; los puestos libres no están. */
export type Alineacion = ReadonlyMap<PuestoAlineacion, Jugador>;
