import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideEchartsCore } from 'ngx-echarts';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { GraficaGolesJornadaComponent } from '../../components/grafica-goles-jornada/grafica-goles-jornada.component';
import { GraficaGolesTramoComponent } from '../../components/grafica-goles-tramo/grafica-goles-tramo.component';
import { GraficaJugadoresComponent } from '../../components/grafica-jugadores/grafica-jugadores.component';
import { GraficaPuntosComponent } from '../../components/grafica-puntos/grafica-puntos.component';
import { ResumenEquipoComponent } from '../../components/resumen-equipo/resumen-equipo.component';
import { DatosEstadisticasService } from '../../services/datos-estadisticas.service';

/** Estadísticas del equipo y de cada jugador, calculadas a partir de los partidos y las actas. */
@Component({
  selector: 'pits-estadisticas-page',
  imports: [
    MensajeEstadoComponent,
    ResumenEquipoComponent,
    GraficaPuntosComponent,
    GraficaGolesJornadaComponent,
    GraficaGolesTramoComponent,
    GraficaJugadoresComponent,
  ],
  providers: [
    DatosEstadisticasService,
    provideEchartsCore({ echarts: () => import('@shared/utils/graficas/echarts-core') }),
  ],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent {
  protected readonly datos = inject(DatosEstadisticasService);
}
