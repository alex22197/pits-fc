import type { Equipo } from '@data-access/equipos/interfaces/equipo.interface';
import type { Partido } from './partido.interface';

/** Una jornada del calendario con sus partidos, ordenados por fecha. */
export interface Jornada {
  readonly id: string;
  readonly numero: number;
  readonly vuelta: 1 | 2;
  /** Fecha del calendario oficial (`AAAA-MM-DD`). */
  readonly fechaPrevista: string;
  readonly descansa: Equipo | null;
  readonly partidos: readonly Partido[];
}
