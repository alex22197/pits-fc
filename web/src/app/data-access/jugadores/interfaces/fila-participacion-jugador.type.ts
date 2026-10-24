import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaPartido } from '@data-access/partidos/interfaces/fila-partido.type';

/** Fila de `participacion` con su partido (equipos y jornada), tal como la devuelve Supabase. */
export type FilaParticipacionJugador = Tables<'participacion'> & {
  readonly partido: FilaPartido & { readonly jornada: Tables<'jornada'> };
};
