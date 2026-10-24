import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaJugador } from '@data-access/jugadores/interfaces/fila-jugador.type';

/** Fila de `convocatoria` con su jugador, tal como la devuelve Supabase. */
export type FilaConvocado = Tables<'convocatoria'> & { readonly jugador: FilaJugador };
