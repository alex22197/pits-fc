import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { EstadoConvocatoria } from './estado-convocatoria.type';

/** Un jugador en la convocatoria de un partido. */
export interface Convocado {
  readonly jugador: Jugador;
  readonly estado: EstadoConvocatoria;
  readonly nota: string | null;
}
