import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';

/** Datos de la ficha de un jugador: sus datos, sus cifras y los partidos que ha jugado. */
@Injectable()
export class DatosJugadorService {
  private readonly jugadores = inject(JugadoresService);
  private readonly estadisticas = inject(EstadisticasService);

  readonly idJugador = signal<string | null>(null);

  readonly jugador = resource({
    params: () => this.idJugador() ?? undefined,
    loader: ({ params }) => this.jugadores.obtenerJugador(params),
  });
  readonly participaciones = resource({
    params: () => this.idJugador() ?? undefined,
    loader: ({ params }) => this.jugadores.obtenerParticipaciones(params),
  });
  readonly todasLasCifras = resource({
    loader: () => this.estadisticas.obtenerEstadisticasJugadores(),
  });

  readonly cifras = computed(
    () =>
      (this.todasLasCifras.value() ?? []).find((c) => c.jugador.id === this.idJugador()) ?? null,
  );
  readonly cargando = computed(() => this.jugador.isLoading());
  readonly error = computed(() => {
    const fallo = this.jugador.error() ?? this.participaciones.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar el jugador.'
        : null;
  });
}
