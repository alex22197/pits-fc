import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaEquipo } from '@data-access/equipos/interfaces/fila-equipo.type';

/** Fila de `clasificacion` con su equipo, tal como la devuelve Supabase. */
export type FilaClasificacionBd = Tables<'clasificacion'> & { readonly equipo: FilaEquipo };
