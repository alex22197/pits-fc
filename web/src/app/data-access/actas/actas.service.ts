import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import type { ActaPartido } from './interfaces/acta-partido.interface';
import { marcadoresDeLosGoles } from './marcadores-acta';

/**
 * Goles y tarjetas de nuestros partidos, tal como los apuntan los gestores después de cada
 * partido. Leer puede cualquiera; guardar, solo gestores (lo decide la base de datos).
 */
@Injectable({ providedIn: 'root' })
export class ActasService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  async obtenerActa(partido: Partido): Promise<ActaPartido> {
    const nuestroId = partido.local.esNuestro ? partido.local.id : partido.visitante.id;
    const [goles, tarjetas] = await Promise.all([
      this.supabase
        .from('gol')
        .select('equipo_id, jugador_id, asistente_id, minuto, marcador_local, marcador_visitante')
        .eq('partido_id', partido.id)
        .order('marcador_local')
        .order('marcador_visitante'),
      this.supabase
        .from('tarjeta')
        .select('jugador_id, tipo, minuto')
        .eq('partido_id', partido.id)
        .order('minuto', { nullsFirst: false }),
    ]);
    lanzarSiHayError(goles.error, 'No se han podido cargar los goles del partido.');
    lanzarSiHayError(tarjetas.error, 'No se han podido cargar las tarjetas del partido.');
    return {
      goles: (goles.data ?? [])
        .sort(
          (a, b) =>
            a.marcador_local + a.marcador_visitante - (b.marcador_local + b.marcador_visitante),
        )
        .map((gol) => ({
          nuestro: gol.equipo_id === nuestroId,
          minuto: gol.minuto,
          jugadorId: gol.jugador_id,
          asistenteId: gol.asistente_id,
        })),
      tarjetas: (tarjetas.data ?? []).map((tarjeta) => ({
        jugadorId: tarjeta.jugador_id,
        tipo: tarjeta.tipo,
        minuto: tarjeta.minuto,
      })),
    };
  }

  /** Sustituye los goles y las tarjetas del partido por los apuntados. */
  async guardarActa(partido: Partido, acta: ActaPartido): Promise<void> {
    const somosLocal = partido.local.esNuestro;
    const nuestroId = somosLocal ? partido.local.id : partido.visitante.id;
    const rivalId = somosLocal ? partido.visitante.id : partido.local.id;
    await this.vaciar('gol', partido.id);
    await this.vaciar('tarjeta', partido.id);
    const goles = marcadoresDeLosGoles(acta.goles, somosLocal).map(({ gol, marcador }) => ({
      partido_id: partido.id,
      equipo_id: gol.nuestro ? nuestroId : rivalId,
      jugador_id: gol.nuestro ? gol.jugadorId : null,
      asistente_id: gol.nuestro ? gol.asistenteId : null,
      minuto: gol.minuto,
      marcador_local: marcador.local,
      marcador_visitante: marcador.visitante,
    }));
    if (goles.length > 0) {
      const { error } = await this.supabase.from('gol').insert(goles);
      lanzarSiHayError(error, 'No se han podido guardar los goles.');
    }
    if (acta.tarjetas.length > 0) {
      const { error } = await this.supabase.from('tarjeta').insert(
        acta.tarjetas.map((tarjeta) => ({
          partido_id: partido.id,
          jugador_id: tarjeta.jugadorId,
          tipo: tarjeta.tipo,
          minuto: tarjeta.minuto,
        })),
      );
      lanzarSiHayError(error, 'No se han podido guardar las tarjetas.');
    }
  }

  private async vaciar(tabla: 'gol' | 'tarjeta', partidoId: string): Promise<void> {
    const { error } = await this.supabase.from(tabla).delete().eq('partido_id', partidoId);
    lanzarSiHayError(error, 'No se ha podido guardar el acta.');
  }
}
