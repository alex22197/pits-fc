import { Injectable, inject } from '@angular/core';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearEquipo } from './equipo.mapper';
import type { Equipo } from './interfaces/equipo.interface';

/** Equipos del grupo. */
@Injectable({ providedIn: 'root' })
export class EquiposService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  async obtenerEquipos(): Promise<Equipo[]> {
    const { data, error } = await this.supabase.from('equipo').select('*').order('nombre');
    lanzarSiHayError(error, 'No se han podido cargar los equipos.');
    return (data ?? []).map(mapearEquipo);
  }

  /** Nuestro equipo. Lanza error si no está dado de alta: sin él la web no tiene sentido. */
  async obtenerNuestroEquipo(): Promise<Equipo> {
    const { data, error } = await this.supabase
      .from('equipo')
      .select('*')
      .eq('es_nuestro', true)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar nuestro equipo.');
    if (!data) {
      throw new ErrorAccesoDatos('Nuestro equipo no está dado de alta en la base de datos.');
    }
    return mapearEquipo(data);
  }
}
