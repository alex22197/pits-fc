import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import type { CambiosJugador } from './interfaces/cambios-jugador.interface';
import type { Jugador } from './interfaces/jugador.interface';
import type { JugadorGestion } from './interfaces/jugador-gestion.interface';
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
      .eq('jugador_id', jugadorId);
    lanzarSiHayError(error, 'No se han podido cargar los partidos del jugador.');
    return (data ?? [])
      .map(mapearParticipacionJugador)
      .sort((a, b) => b.partido.jornadaNumero - a.partido.jornadaNumero);
  }

  /** Todos los jugadores, también los inactivos, con su nombre de federación. Solo gestores. */
  async obtenerPlantillaParaGestion(): Promise<JugadorGestion[]> {
    const { data, error } = await this.supabase
      .from('jugador')
      .select('*, jugador_privado(nombre_federacion)')
      .order('activo', { ascending: false })
      .order('dorsal', { nullsFirst: false })
      .order('nombre_mostrar');
    lanzarSiHayError(error, 'No se ha podido cargar la plantilla.');
    return (data ?? []).map((fila) => ({
      jugador: mapearJugador(fila),
      nombreFederacion: fila.jugador_privado?.nombre_federacion ?? null,
    }));
  }

  /** Guarda los cambios de un gestor en un jugador. */
  async guardarJugador(id: string, cambios: CambiosJugador): Promise<void> {
    const { error } = await this.supabase
      .from('jugador')
      .update({
        nombre_mostrar: cambios.nombreMostrar.trim(),
        dorsal: cambios.dorsal,
        posicion: cambios.posicion,
        activo: cambios.activo,
      })
      .eq('id', id);
    lanzarSiHayError(error, mensajeDeGuardado(error));
  }
}

/** Mensajes claros para los fallos previsibles al guardar un jugador. */
function mensajeDeGuardado(error: { code?: string; message?: string } | null): string {
  if (error?.code === '23505' && error.message?.includes('dorsal')) {
    return 'Ese dorsal ya lo lleva otro jugador activo.';
  }
  if (error?.code === '23505') {
    return 'Ya hay otro jugador con ese nombre.';
  }
  return 'No se ha podido guardar el jugador.';
}
