import type { Partido } from '@data-access/partidos/interfaces/partido.interface';

/** Un partido que jugó un jugador, de inicio o desde el banquillo. */
export interface ParticipacionJugador {
  readonly partido: Partido;
  readonly titular: boolean;
  readonly dorsal: number | null;
}
