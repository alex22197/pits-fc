import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPETICION_ACTUAL } from '@core/config/sitio.constants';
import { ENLACES_NAVEGACION } from '@core/layout/enlaces-navegacion';
import { IconoComponent } from '@shared/components/icono/icono.component';

/**
 * Portada. De momento presenta el equipo y las secciones; cuando haya datos mostrará el
 * próximo partido, la convocatoria y el último resultado (ver docs/hoja-de-ruta.md).
 */
@Component({
  selector: 'pits-inicio-page',
  imports: [RouterLink, IconoComponent],
  templateUrl: './inicio-page.component.html',
  styleUrl: './inicio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioPageComponent {
  protected readonly competicion = COMPETICION_ACTUAL;
  protected readonly secciones = ENLACES_NAVEGACION.filter((enlace) => enlace.ruta !== '/');
}
