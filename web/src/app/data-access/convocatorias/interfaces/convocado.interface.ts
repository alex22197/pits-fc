import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { EstadoConvocatoria } from './estado-convocatoria.type';
import type { PuestoAlineacion } from './puesto-alineacion.type';

/** Un jugador en la convocatoria de un partido. Titular si tiene puesto; si no, banquillo. */
export interface Convocado {
  readonly jugador: Jugador;
  readonly estado: EstadoConvocatoria;
  readonly puesto: PuestoAlineacion | null;
  readonly nota: string | null;
}
