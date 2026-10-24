import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import type { Jornada } from '@data-access/partidos/interfaces/jornada.interface';
import { PartidosService } from '@data-access/partidos/partidos.service';
import { elegirJornadaActual } from '@data-access/partidos/jornada-actual';
import { hoyEnMadrid } from '@shared/utils/fechas/hoy';

/** Datos de la página de calendario: todas las jornadas, con filtro a nuestros partidos. */
@Injectable()
export class DatosCalendarioService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly partidos = inject(PartidosService);

  readonly soloNuestros = signal(false);

  readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });
  readonly calendario = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.partidos.obtenerCalendario(params),
  });

  readonly jornadas = computed<readonly Jornada[]>(() => {
    const jornadas = this.calendario.value() ?? [];
    if (!this.soloNuestros()) {
      return jornadas;
    }
    return jornadas.map((jornada) => ({
      ...jornada,
      partidos: jornada.partidos.filter((partido) => partido.esNuestro),
    }));
  });

  readonly jornadaActual = computed(() =>
    elegirJornadaActual(this.calendario.value() ?? [], hoyEnMadrid()),
  );
  readonly cargando = computed(() => this.competicion.isLoading() || this.calendario.isLoading());
  readonly error = computed(() => {
    const fallo = this.competicion.error() ?? this.calendario.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar el calendario.'
        : null;
  });
}
