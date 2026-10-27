import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { GolesJornada } from '@data-access/estadisticas/interfaces/goles-jornada.interface';
import { GraficaComponent } from '@shared/components/grafica/grafica.component';
import type { TablaDatos } from '@shared/components/grafica/interfaces/tabla-datos.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import {
  ejeCategorias,
  ejeValores,
  leyenda,
  opcionesBase,
  serieBarras,
} from '@shared/utils/graficas/opciones-base';

/** Goles a favor y en contra en cada jornada, en barras agrupadas. */
@Component({
  selector: 'pits-grafica-goles-jornada',
  imports: [GraficaComponent],
  templateUrl: './grafica-goles-jornada.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaGolesJornadaComponent {
  readonly goles = input.required<readonly GolesJornada[]>();

  private readonly colores = inject(TemaGraficasService).obtenerColores();

  protected readonly opciones = computed<EChartsCoreOption>(() => ({
    ...opcionesBase(this.colores),
    legend: leyenda(this.colores),
    xAxis: ejeCategorias(
      this.colores,
      this.goles().map((jornada) => `J${jornada.jornada}`),
    ),
    yAxis: ejeValores(this.colores),
    series: [
      serieBarras(
        'A favor',
        this.goles().map((jornada) => jornada.favor),
        this.colores.nosotros,
      ),
      serieBarras(
        'En contra',
        this.goles().map((jornada) => jornada.contra),
        this.colores.rival,
      ),
    ],
  }));

  protected readonly tabla = computed<TablaDatos>(() => ({
    cabeceras: ['Jornada', 'Rival', 'A favor', 'En contra'],
    filas: this.goles().map((jornada) => [
      jornada.jornada,
      jornada.rival,
      jornada.favor,
      jornada.contra,
    ]),
  }));
}
