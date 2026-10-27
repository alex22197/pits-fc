import { Injectable, inject } from '@angular/core';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearEjecucion } from './ejecucion.mapper';
import type { EjecucionImportacion } from './interfaces/ejecucion-importacion.interface';

const FUNCION = 'importar-federacion';
/** La única región de Supabase desde la que la intranet acepta conexiones (docs/scraper.md). */
const REGION = 'eu-west-3';

/**
 * Importaciones de la federación. Cuándo acabó la última correcta lo ve cualquiera; el
 * registro y lanzar una a mano, solo los gestores.
 */
@Injectable({ providedIn: 'root' })
export class ImportacionService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Fin de la última importación correcta, o `null` si aún no ha habido ninguna. */
  async obtenerUltimaImportacion(): Promise<Date | null> {
    const { data, error } = await this.supabase.rpc('ultima_importacion');
    lanzarSiHayError(error, 'No se ha podido saber cuándo se actualizaron los datos.');
    return data ? new Date(data) : null;
  }

  /** Las últimas ejecuciones, de la más reciente a la más antigua. */
  async obtenerEjecuciones(limite = 10): Promise<EjecucionImportacion[]> {
    const { data, error } = await this.supabase
      .from('ejecucion_scraper')
      .select('*')
      .order('inicio', { ascending: false })
      .limit(limite);
    lanzarSiHayError(error, 'No se han podido cargar las importaciones.');
    return (data ?? []).map(mapearEjecucion);
  }

  /** Llama a la función del scraper con la sesión del gestor y espera a que termine. */
  async lanzar(): Promise<void> {
    const { error } = await this.supabase.functions.invoke(FUNCION, {
      body: { origen: 'web' },
      headers: { 'x-region': REGION },
    });
    if (error) {
      throw new ErrorAccesoDatos(
        'La importación ha fallado. Mira el registro para ver qué ha pasado.',
        error,
      );
    }
  }
}
