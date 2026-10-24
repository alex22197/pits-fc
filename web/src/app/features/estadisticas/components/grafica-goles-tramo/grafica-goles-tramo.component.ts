import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { GolesTramo } from '@data-access/estadisticas/interfaces/goles-tramo.interface';
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

/** En qué minutos caen los goles, a favor y en contra, por tramos de diez. */
@Component({
  selector: 'pits-grafica-goles-tramo',
  imports: [GraficaComponent],
  templateUrl: './grafica-goles-tramo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaGolesTramoComponent {
  readonly tramos = input.required<readonly GolesTramo[]>();

  private readonly colores = inject(TemaGraficasService).obtenerColores();

  protected readonly opciones = computed<EChartsCoreOption>(() => ({
    ...opcionesBase(this.colores),
    legend: leyenda(this.colores),
    xAxis: ejeCategorias(
      this.colores,
      this.tramos().map((tramo) => tramo.tramo),
    ),
    yAxis: ejeValores(this.colores),
    series: [
      serieBarras(
        'A favor',
        this.tramos().map((tramo) => tramo.favor),
        this.colores.nosotros,
      ),
      serieBarras(
        'En contra',
        this.tramos().map((tramo) => tramo.contra),
        this.colores.rival,
      ),
    ],
  }));

  protected readonly tabla = computed<TablaDatos>(() => ({
    cabeceras: ['Minutos', 'A favor', 'En contra'],
    filas: this.tramos().map((tramo) => [tramo.tramo, tramo.favor, tramo.contra]),
  }));
}
