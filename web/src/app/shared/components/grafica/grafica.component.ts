import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { TablaDatos } from './interfaces/tabla-datos.interface';

/**
 * Una gráfica con su título, una descripción corta y los mismos datos en una tabla plegada,
 * para que nada dependa del color ni del ratón. Las opciones las construye quien la usa; el
 * motor de ECharts lo provee la página con `provideEchartsCore`.
 */
@Component({
  selector: 'pits-grafica',
  imports: [NgxEchartsDirective],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaComponent {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');
  readonly opciones = input.required<EChartsCoreOption>();
  readonly tabla = input.required<TablaDatos>();
  readonly altura = input<number>(280);
}
