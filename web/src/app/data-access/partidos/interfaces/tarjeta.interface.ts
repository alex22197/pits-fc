import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { TipoTarjeta } from './tipo-tarjeta.type';

/** Una tarjeta a uno de nuestros jugadores. */
export interface Tarjeta {
  readonly id: string;
  readonly jugador: Jugador;
  readonly tipo: TipoTarjeta;
  readonly minuto: number | null;
}
