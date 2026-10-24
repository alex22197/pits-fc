import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaJugador } from '@data-access/jugadores/interfaces/fila-jugador.type';
import type { FilaPartido } from './fila-partido.type';

/** Fila de `partido` con jornada, equipos y todo lo que trae el acta. */
export type FilaDetallePartido = FilaPartido & {
  readonly jornada: Tables<'jornada'>;
  readonly participaciones: readonly (Tables<'participacion'> & {
    readonly jugador: FilaJugador;
  })[];
  readonly goles: readonly (Tables<'gol'> & { readonly jugador: FilaJugador | null })[];
  readonly tarjetas: readonly (Tables<'tarjeta'> & { readonly jugador: FilaJugador })[];
};
