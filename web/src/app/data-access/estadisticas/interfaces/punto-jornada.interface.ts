import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';

/** Puntos acumulados tras cada jornada jugada, con el partido que los dio. */
export interface PuntoJornada {
  readonly jornada: number;
  readonly puntos: number;
  readonly resultado: ResultadoPartido;
  readonly rival: string;
  /** Marcador desde nuestro punto de vista, p. ej. «3-1». */
  readonly marcador: string;
}
