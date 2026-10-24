import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaJugador } from '@data-access/jugadores/interfaces/fila-jugador.type';

/** Fila de `gol` con su partido (y jornada) y su autor, tal como la devuelve Supabase. */
export type FilaGolEquipo = Tables<'gol'> & {
  readonly partido: Pick<Tables<'partido'>, 'id' | 'local_id' | 'visitante_id'> & {
    readonly jornada: Pick<Tables<'jornada'>, 'numero'>;
  };
  readonly jugador: FilaJugador | null;
};
