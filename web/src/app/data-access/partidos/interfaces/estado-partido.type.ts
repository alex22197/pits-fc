import type { Enums } from '@core/supabase/interfaces/database.types';

/** Situación de un partido: por jugar, jugado, aplazado o suspendido. */
export type EstadoPartido = Enums<'estado_partido'>;
