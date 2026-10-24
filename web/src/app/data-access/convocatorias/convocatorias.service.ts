import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { compararConvocados, mapearConvocado } from './convocado.mapper';
import type { Convocado } from './interfaces/convocado.interface';
import type { DecisionConvocatoria } from './interfaces/decision-convocatoria.interface';

/**
 * Convocatorias de nuestros partidos. Un visitante solo recibe las publicadas: la base de
 * datos devuelve vacío para las demás. Guardar y publicar es cosa de gestores.
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

  /** Sustituye la convocatoria de un partido por las decisiones dadas. */
  async guardarConvocatoria(
    partidoId: string,
    decisiones: readonly DecisionConvocatoria[],
  ): Promise<void> {
    const { error: errorBorrado } = await this.supabase
      .from('convocatoria')
      .delete()
      .eq('partido_id', partidoId);
    lanzarSiHayError(errorBorrado, 'No se ha podido guardar la convocatoria.');
    if (decisiones.length === 0) {
      return;
    }
    const { error } = await this.supabase.from('convocatoria').insert(
      decisiones.map((decision) => ({
        partido_id: partidoId,
        jugador_id: decision.jugadorId,
        estado: decision.estado,
        nota: decision.nota?.trim() || null,
      })),
    );
    lanzarSiHayError(error, 'No se ha podido guardar la convocatoria.');
  }

  /** Publica (o retira) la convocatoria de un partido para que la vea todo el mundo. */
  async publicar(partidoId: string, publicada: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('partido')
      .update({ convocatoria_publicada: publicada })
      .eq('id', partidoId);
    lanzarSiHayError(error, 'No se ha podido cambiar la publicación de la convocatoria.');
  }
}
