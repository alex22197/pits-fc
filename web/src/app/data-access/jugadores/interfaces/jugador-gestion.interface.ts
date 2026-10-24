import type { Jugador } from './jugador.interface';

/** Un jugador tal como lo ve un gestor: con el nombre que figura en las actas. */
export interface JugadorGestion {
  readonly jugador: Jugador;
  /** `null` si aún no se ha asociado con ningún acta. */
  readonly nombreFederacion: string | null;
}
