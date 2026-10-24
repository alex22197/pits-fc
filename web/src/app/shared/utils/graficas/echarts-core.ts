// Solo las piezas de ECharts que usa la web, para que el paquete de la sección de
// estadísticas sea pequeño. Se carga de forma diferida con `provideEchartsCore`.
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

use([
  BarChart,
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  LegacyGridContainLabel,
]);

export * from 'echarts/core';
