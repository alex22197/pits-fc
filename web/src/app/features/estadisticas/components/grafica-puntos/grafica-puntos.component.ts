import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { PuntoJornada } from '@data-access/estadisticas/interfaces/punto-jornada.interface';
import { GraficaComponent } from '@shared/components/grafica/grafica.component';
import type { TablaDatos } from '@shared/components/grafica/interfaces/tabla-datos.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import {
  ejeCategorias,
  ejeValores,
  opcionesBase,
  serieLinea,
} from '@shared/utils/graficas/opciones-base';

/** Puntos acumulados jornada a jornada: una sola línea, cada punto con su partido. */
@Component({
  selector: 'pits-grafica-puntos',
  imports: [GraficaComponent],
  templateUrl: './grafica-puntos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaPuntosComponent {
  readonly puntos = input.required<readonly PuntoJornada[]>();

  private readonly colores = inject(TemaGraficasService).obtenerColores();

  protected readonly opciones = computed<EChartsCoreOption>(() => {
    const puntos = this.puntos();
    return {
      ...opcionesBase(this.colores),
      tooltip: {
        ...(opcionesBase(this.colores)['tooltip'] as object),
        formatter: (parametros: unknown): string => {
          const indice = (parametros as { dataIndex: number }[])[0]?.dataIndex ?? 0;
          const punto = puntos[indice];
          return punto
            ? `${punto.puntos} puntos · J${punto.jornada} ${punto.marcador} contra ${punto.rival}`
            : '';
        },
      },
      xAxis: ejeCategorias(
        this.colores,
        puntos.map((punto) => `J${punto.jornada}`),
      ),
      yAxis: ejeValores(this.colores),
      series: [
        serieLinea(
          'Puntos',
          puntos.map((punto) => punto.puntos),
          this.colores.nosotros,
          this.colores,
        ),
      ],
    };
  });

  protected readonly tabla = computed<TablaDatos>(() => ({
    cabeceras: ['Jornada', 'Rival', 'Marcador', 'Resultado', 'Puntos'],
    filas: this.puntos().map((punto) => [
      punto.jornada,
      punto.rival,
      punto.marcador,
      punto.resultado,
      punto.puntos,
    ]),
  }));
}
