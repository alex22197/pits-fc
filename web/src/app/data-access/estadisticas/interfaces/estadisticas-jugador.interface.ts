import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Lo que las actas dicen de un jugador a lo largo de la temporada. */
export interface EstadisticasJugador {
  readonly jugador: Jugador;
  readonly partidos: number;
  readonly titularidades: number;
  readonly goles: number;
  readonly amarillas: number;
  readonly rojas: number;
  /** Goles del rival en los partidos que jugó; solo tiene sentido para porteros. */
  readonly golesEncajados: number;
}
