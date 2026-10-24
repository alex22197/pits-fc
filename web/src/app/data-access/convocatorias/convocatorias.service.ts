import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { compararConvocados, mapearConvocado } from './convocado.mapper';
import type { Convocado } from './interfaces/convocado.interface';

/**
 * Convocatorias de nuestros partidos. Un visitante solo recibe las publicadas: la base de
 * datos devuelve vacío para las demás.
 */
@Injectable({ providedIn: 'root' })
export class ConvocatoriasService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  async obtenerConvocatoria(partidoId: string): Promise<Convocado[]> {
    const { data, error } = await this.supabase
      .from('convocatoria')
      .select('*, jugador(*)')
      .eq('partido_id', partidoId);
    lanzarSiHayError(error, 'No se ha podido cargar la convocatoria.');
    return (data ?? []).map(mapearConvocado).sort(compararConvocados);
  }
}
