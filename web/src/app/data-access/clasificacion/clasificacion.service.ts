import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearFilaClasificacion } from './fila-clasificacion.mapper';
import type { FilaClasificacion } from './interfaces/fila-clasificacion.interface';

/** Clasificación del grupo, tal como la importó el scraper por última vez. */
@Injectable({ providedIn: 'root' })
export class ClasificacionService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Filas por posición. Vacío mientras el scraper no haya importado nada. */
  async obtenerClasificacion(competicionId: string): Promise<FilaClasificacion[]> {
    const { data, error } = await this.supabase
      .from('clasificacion')
      .select('*, equipo(*)')
      .eq('competicion_id', competicionId)
      .order('posicion');
    lanzarSiHayError(error, 'No se ha podido cargar la clasificación.');
    return (data ?? []).map(mapearFilaClasificacion);
  }
}
