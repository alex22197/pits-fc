import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearDetallePartido } from './detalle-partido.mapper';
import type { DetallePartido } from './interfaces/detalle-partido.interface';
import type { Jornada } from './interfaces/jornada.interface';
import { mapearJornada } from './jornada.mapper';

const EQUIPOS_DEL_PARTIDO =
  'local:equipo!partido_local_id_fkey(*), visitante:equipo!partido_visitante_id_fkey(*)';

/** Calendario, partidos y actas de la competición. */
@Injectable({ providedIn: 'root' })
export class PartidosService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Todas las jornadas de la competición con sus partidos, en orden. */
  async obtenerCalendario(competicionId: string): Promise<Jornada[]> {
    const { data, error } = await this.supabase
      .from('jornada')
      .select(
        `*, descansa:equipo!jornada_descansa_id_fkey(*), partidos:partido(*, ${EQUIPOS_DEL_PARTIDO})`,
      )
      .eq('competicion_id', competicionId)
      .order('numero');
    lanzarSiHayError(error, 'No se ha podido cargar el calendario.');
    return (data ?? []).map(mapearJornada);
  }

  /** Un partido con todo lo que trae su acta, o `null` si no existe. */
  async obtenerDetalle(partidoId: string): Promise<DetallePartido | null> {
    const { data, error } = await this.supabase
      .from('partido')
      .select(
        `*, jornada(*), ${EQUIPOS_DEL_PARTIDO},
         participaciones:participacion(*, jugador(*)),
         goles:gol(*, jugador(*)),
         tarjetas:tarjeta(*, jugador(*))`,
      )
      .eq('id', partidoId)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar el partido.');
    return data ? mapearDetallePartido(data) : null;
  }
}
