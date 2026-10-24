import { Injectable, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { EquiposService } from '@data-access/equipos/equipos.service';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { golesPorTramo } from '@data-access/estadisticas/goles-por-tramo';
import { golesPorJornada, puntosPorJornada } from '@data-access/estadisticas/puntos-por-jornada';
import { calcularResumenEquipo } from '@data-access/estadisticas/resumen-equipo';
import { PartidosService } from '@data-access/partidos/partidos.service';
import { partidosDeNuestroEquipo } from '@data-access/partidos/proximo-partido';

/**
 * Datos de la página de estadísticas. Cada origen se carga con `resource()` y lo derivado
 * se calcula con funciones puras de `data-access`. Vive con la página que lo provee.
 */
@Injectable()
export class DatosEstadisticasService {
  private readonly equipos = inject(EquiposService);
  private readonly competiciones = inject(CompeticionesService);
  private readonly partidos = inject(PartidosService);
  private readonly clasificacion = inject(ClasificacionService);
  private readonly estadisticas = inject(EstadisticasService);

  readonly nuestro = resource({ loader: () => this.equipos.obtenerNuestroEquipo() });
  readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });

  readonly calendario = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.partidos.obtenerCalendario(params),
  });
  readonly tabla = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.clasificacion.obtenerClasificacion(params),
  });
  readonly jugadores = resource({
    loader: () => this.estadisticas.obtenerEstadisticasJugadores(),
  });
  readonly goles = resource({
    params: () => this.nuestro.value()?.id,
    loader: ({ params }) => this.estadisticas.obtenerGolesDeNuestrosPartidos(params),
  });

  readonly partidosNuestros = computed(() =>
    partidosDeNuestroEquipo(this.calendario.value() ?? []),
  );
  readonly resumen = computed(() => calcularResumenEquipo(this.partidosNuestros()));
  readonly puntos = computed(() => puntosPorJornada(this.partidosNuestros()));
  readonly golesJornada = computed(() => golesPorJornada(this.partidosNuestros()));
  readonly tramos = computed(() => golesPorTramo(this.goles.value() ?? []));
  readonly posicion = computed(
    () => (this.tabla.value() ?? []).find((fila) => fila.equipo.esNuestro) ?? null,
  );
  readonly jugadoresConDatos = computed(() =>
    (this.jugadores.value() ?? []).filter((jugador) => jugador.partidos > 0),
  );

  readonly cargandoEquipo = computed(
    () => this.competicion.isLoading() || this.calendario.isLoading() || this.tabla.isLoading(),
  );
  readonly cargandoJugadores = computed(
    () => this.nuestro.isLoading() || this.jugadores.isLoading() || this.goles.isLoading(),
  );
  readonly error = computed(() => {
    const fallo = [
      this.nuestro,
      this.competicion,
      this.calendario,
      this.tabla,
      this.jugadores,
      this.goles,
    ]
      .map((recurso) => recurso.error())
      .find((error) => error !== undefined);
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se han podido cargar los datos.'
        : null;
  });
}
