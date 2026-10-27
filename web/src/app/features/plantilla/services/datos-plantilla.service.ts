import { Injectable, computed, inject, resource } from '@angular/core';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import type { EstadisticasJugador } from '@data-access/estadisticas/interfaces/estadisticas-jugador.interface';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';

/** Datos de la página de plantilla: los jugadores activos y sus cifras de la temporada. */
@Injectable()
export class DatosPlantillaService {
  private readonly jugadores = inject(JugadoresService);
  private readonly estadisticas = inject(EstadisticasService);

  readonly plantilla = resource({ loader: () => this.jugadores.obtenerPlantilla() });
  readonly cifras = resource({ loader: () => this.estadisticas.obtenerEstadisticasJugadores() });

  readonly cifrasPorJugador = computed(() => {
    const mapa = new Map<string, EstadisticasJugador>();
    for (const cifras of this.cifras.value() ?? []) {
      mapa.set(cifras.jugador.id, cifras);
    }
    return mapa;
  });

  readonly cargando = computed(() => this.plantilla.isLoading());
  readonly error = computed(() => {
    const fallo = this.plantilla.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar la plantilla.'
        : null;
  });
}
