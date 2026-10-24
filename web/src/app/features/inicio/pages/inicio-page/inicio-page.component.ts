import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPETICION_ACTUAL } from '@core/config/sitio.constants';
import { ENLACES_NAVEGACION } from '@core/layout/enlaces-navegacion';
import { ConvocatoriaPartidoComponent } from '@shared/components/convocatoria-partido/convocatoria-partido.component';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';
import { TarjetaPartidoComponent } from '@shared/components/tarjeta-partido/tarjeta-partido.component';
import { ProximoPartidoComponent } from '../../components/proximo-partido/proximo-partido.component';
import { DatosInicioService } from '../../services/datos-inicio.service';

/** Portada: próximo partido con su convocatoria, último resultado, clasificación y secciones. */
@Component({
  selector: 'pits-inicio-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    ProximoPartidoComponent,
    ConvocatoriaPartidoComponent,
    TarjetaPartidoComponent,
    TablaClasificacionComponent,
  ],
  providers: [DatosInicioService],
  templateUrl: './inicio-page.component.html',
  styleUrl: './inicio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioPageComponent {
  protected readonly datos = inject(DatosInicioService);
  protected readonly competicion = COMPETICION_ACTUAL;
  protected readonly secciones = ENLACES_NAVEGACION.filter((enlace) => enlace.ruta !== '/');
}
