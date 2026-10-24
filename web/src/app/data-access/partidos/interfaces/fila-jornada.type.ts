import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaEquipo } from '@data-access/equipos/interfaces/fila-equipo.type';
import type { FilaPartido } from './fila-partido.type';

/** Fila de `jornada` con el equipo que descansa y sus partidos. */
export type FilaJornada = Tables<'jornada'> & {
  readonly descansa: FilaEquipo | null;
  readonly partidos: readonly FilaPartido[];
};
