import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { EstadisticasJugador } from '@data-access/estadisticas/interfaces/estadisticas-jugador.interface';
import { GraficaComponent } from '@shared/components/grafica/grafica.component';
import type { TablaDatos } from '@shared/components/grafica/interfaces/tabla-datos.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import {
  ejeCategorias,
  ejeValores,
  leyenda,
  opcionesBase,
  serieBarrasHorizontales,
} from '@shared/utils/graficas/opciones-base';
import type { MedidaJugadores } from './interfaces/medida-jugadores.type';

const ALTO_POR_JUGADOR = 28;
const ALTO_MINIMO = 160;

/**
 * Ranking de jugadores en barras horizontales para una medida: goles, partidos (titular y
 * suplente apilados) o tarjetas (amarillas y rojas apiladas).
 */
@Component({
  selector: 'pits-grafica-jugadores',
  imports: [GraficaComponent],
  templateUrl: './grafica-jugadores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaJugadoresComponent {
  readonly jugadores = input.required<readonly EstadisticasJugador[]>();
  readonly medida = input.required<MedidaJugadores>();
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');

  private readonly colores = inject(TemaGraficasService).obtenerColores();

  /** De más a menos, y solo los que tienen algo que contar en esta medida. */
  protected readonly ordenados = computed(() =>
    [...this.jugadores()]
      .filter((jugador) => this.total(jugador) > 0)
      .sort(
        (a, b) =>
          this.total(b) - this.total(a) ||
          a.jugador.nombreMostrar.localeCompare(b.jugador.nombreMostrar),
      )
      .reverse(),
  );

  protected readonly altura = computed(() =>
    Math.max(ALTO_MINIMO, this.ordenados().length * ALTO_POR_JUGADOR + 56),
  );

  protected readonly opciones = computed<EChartsCoreOption>(() => {
    const nombres = this.ordenados().map((jugador) => jugador.jugador.nombreMostrar);
    const base = opcionesBase(this.colores);
    const series = this.series();
    return {
      ...base,
      grid: { left: 8, right: 32, top: series.length > 1 ? 32 : 8, bottom: 8, containLabel: true },
      legend: series.length > 1 ? leyenda(this.colores) : undefined,
      xAxis: { ...ejeValores(this.colores), position: 'top' },
      yAxis: ejeCategorias(this.colores, nombres),
      series,
    };
  });

  protected readonly tabla = computed<TablaDatos>(() => {
    const filas = [...this.ordenados()].reverse();
    switch (this.medida()) {
      case 'goles':
        return {
          cabeceras: ['Jugador', 'Goles'],
          filas: filas.map((j) => [j.jugador.nombreMostrar, j.goles]),
        };
      case 'asistencias':
        return {
          cabeceras: ['Jugador', 'Asistencias'],
          filas: filas.map((j) => [j.jugador.nombreMostrar, j.asistencias]),
        };
      case 'partidos':
        return {
          cabeceras: ['Jugador', 'Titular', 'Suplente', 'Total'],
          filas: filas.map((j) => [
            j.jugador.nombreMostrar,
            j.titularidades,
            j.partidos - j.titularidades,
            j.partidos,
          ]),
        };
      case 'tarjetas':
        return {
          cabeceras: ['Jugador', 'Amarillas', 'Rojas'],
          filas: filas.map((j) => [j.jugador.nombreMostrar, j.amarillas, j.rojas]),
        };
    }
  });

  private series(): Record<string, unknown>[] {
    const lista = this.ordenados();
    switch (this.medida()) {
      case 'goles':
        return [
          serieBarrasHorizontales(
            'Goles',
            lista.map((j) => j.goles),
            this.colores.nosotros,
            this.colores,
          ),
        ];
      case 'asistencias':
        return [
          serieBarrasHorizontales(
            'Asistencias',
            lista.map((j) => j.asistencias),
            this.colores.nosotros,
            this.colores,
          ),
        ];
      case 'partidos':
        return [
          serieBarrasHorizontales(
            'Titular',
            lista.map((j) => j.titularidades),
            this.colores.nosotros,
            this.colores,
            true,
          ),
          serieBarrasHorizontales(
            'Suplente',
            lista.map((j) => j.partidos - j.titularidades),
            this.colores.rival,
            this.colores,
            true,
          ),
        ];
      case 'tarjetas':
        return [
          serieBarrasHorizontales(
            'Amarillas',
            lista.map((j) => j.amarillas),
            this.colores.empate,
            this.colores,
            true,
          ),
          serieBarrasHorizontales(
            'Rojas',
            lista.map((j) => j.rojas),
            this.colores.derrota,
            this.colores,
            true,
          ),
        ];
    }
  }

  private total(jugador: EstadisticasJugador): number {
    switch (this.medida()) {
      case 'goles':
        return jugador.goles;
      case 'asistencias':
        return jugador.asistencias;
      case 'partidos':
        return jugador.partidos;
      case 'tarjetas':
        return jugador.amarillas + jugador.rojas;
    }
  }
}
