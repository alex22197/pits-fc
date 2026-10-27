import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearCompeticion } from './competicion.mapper';
import type { Competicion } from './interfaces/competicion.interface';

/** Competiciones del equipo. De momento solo hay una activa. */
@Injectable({ providedIn: 'root' })
export class CompeticionesService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** La competición en curso, o `null` si no hay ninguna activa. */
  async obtenerActiva(): Promise<Competicion | null> {
    const { data, error } = await this.supabase
      .from('competicion')
      .select('*')
      .eq('activa', true)
      .order('temporada', { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar la competición.');
    return data ? mapearCompeticion(data) : null;
  }
}
