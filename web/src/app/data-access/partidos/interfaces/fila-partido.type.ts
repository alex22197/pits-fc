import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaEquipo } from '@data-access/equipos/interfaces/fila-equipo.type';

/** Fila de `partido` con los dos equipos, tal como la devuelve Supabase. */
export type FilaPartido = Tables<'partido'> & {
  readonly local: FilaEquipo;
  readonly visitante: FilaEquipo;
};

/** Lo que un partido necesita de su jornada para mostrarse suelto. */
export type DatosJornadaDePartido = Pick<Tables<'jornada'>, 'numero' | 'fecha_prevista'>;
