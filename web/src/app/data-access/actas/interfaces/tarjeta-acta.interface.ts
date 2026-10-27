import type { TipoTarjeta } from '@data-access/partidos/interfaces/tipo-tarjeta.type';

/** Una tarjeta a uno de los nuestros, tal como la apunta un gestor. */
export interface TarjetaActa {
  readonly jugadorId: string;
  readonly tipo: TipoTarjeta;
  readonly minuto: number | null;
}
