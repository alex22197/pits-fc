import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearEstadisticasJugador, tieneJugador } from './estadisticas-jugador.mapper';
import type { EstadisticasJugador } from './interfaces/estadisticas-jugador.interface';

/** Estadísticas de los jugadores a partir de las actas importadas. */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Todos los jugadores, de más a menos goles y después por nombre. */
  async obtenerEstadisticasJugadores(): Promise<EstadisticasJugador[]> {
    const { data, error } = await this.supabase
      .from('estadisticas_jugador')
      .select('*')
      .order('goles', { ascending: false })
      .order('nombre_mostrar');
    lanzarSiHayError(error, 'No se han podido cargar las estadísticas.');
    return (data ?? []).filter(tieneJugador).map(mapearEstadisticasJugador);
  }
}
