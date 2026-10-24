import type { Gol } from './gol.interface';
import type { Participante } from './participante.interface';
import type { Partido } from './partido.interface';
import type { Tarjeta } from './tarjeta.interface';

/** Un partido con todo lo que trae su acta. */
export interface DetallePartido {
  readonly partido: Partido;
  /** Titulares primero, luego suplentes; dentro de cada grupo por dorsal. */
  readonly participantes: readonly Participante[];
  /** En orden de marcador. */
  readonly goles: readonly Gol[];
  /** En orden de minuto. */
  readonly tarjetas: readonly Tarjeta[];
}
