import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearEstadisticasJugador, tieneJugador } from './estadisticas-jugador.mapper';
import { mapearGolEquipo } from './gol-equipo.mapper';
import type { EstadisticasJugador } from './interfaces/estadisticas-jugador.interface';
import type { GolEquipo } from './interfaces/gol-equipo.interface';

/** Estadísticas de los jugadores y goles del equipo a partir de las actas importadas. */
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

  /** Todos los goles de nuestros partidos (nuestros y del rival), en orden de marcador. */
  async obtenerGolesDeNuestrosPartidos(nuestroEquipoId: string): Promise<GolEquipo[]> {
    const { data, error } = await this.supabase
      .from('gol')
      .select('*, partido!inner(id, local_id, visitante_id, jornada(numero)), jugador(*)')
      .or(`local_id.eq.${nuestroEquipoId},visitante_id.eq.${nuestroEquipoId}`, {
        referencedTable: 'partido',
      })
      .order('marcador_local')
      .order('marcador_visitante');
    lanzarSiHayError(error, 'No se han podido cargar los goles.');
    return (data ?? []).map((fila) => mapearGolEquipo(fila, nuestroEquipoId));
  }
}
