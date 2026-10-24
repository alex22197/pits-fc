import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import type { Jugador } from './interfaces/jugador.interface';
import type { ParticipacionJugador } from './interfaces/participacion-jugador.interface';
import { mapearJugador } from './jugador.mapper';
import { mapearParticipacionJugador } from './participacion-jugador.mapper';

/** Plantilla de nuestro equipo. */
@Injectable({ providedIn: 'root' })
export class JugadoresService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Jugadores activos, por dorsal (los que no tienen dorsal, al final). */
  async obtenerPlantilla(): Promise<Jugador[]> {
    const { data, error } = await this.supabase
      .from('jugador')
      .select('*')
      .eq('activo', true)
      .order('dorsal', { nullsFirst: false })
      .order('nombre_mostrar');
    lanzarSiHayError(error, 'No se ha podido cargar la plantilla.');
    return (data ?? []).map(mapearJugador);
  }

  /** Un jugador por id, o `null` si no existe. */
  async obtenerJugador(id: string): Promise<Jugador | null> {
    const { data, error } = await this.supabase
      .from('jugador')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar el jugador.');
    return data ? mapearJugador(data) : null;
  }

  /** Los partidos que ha jugado un jugador según las actas, del más reciente al más antiguo. */
  async obtenerParticipaciones(jugadorId: string): Promise<ParticipacionJugador[]> {
    const { data, error } = await this.supabase
      .from('participacion')
      .select(
        '*, partido!inner(*, jornada!inner(*), local:equipo!partido_local_id_fkey(*), visitante:equipo!partido_visitante_id_fkey(*))',
      )
      .eq('jugador_id', jugadorId)
      .order('numero', { referencedTable: 'partido.jornada', ascending: false });
    lanzarSiHayError(error, 'No se han podido cargar los partidos del jugador.');
    return (data ?? [])
      .map(mapearParticipacionJugador)
      .sort((a, b) => b.partido.jornadaNumero - a.partido.jornadaNumero);
  }
}
