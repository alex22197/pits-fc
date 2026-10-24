import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { ENLACES_NAVEGACION } from '../../enlaces-navegacion';

/** Cabecera con el nombre del equipo, el menú (en escritorio) y el acceso a la cuenta. */
@Component({
  selector: 'pits-cabecera-sitio',
  imports: [RouterLink, RouterLinkActive, IconoComponent],
  templateUrl: './cabecera-sitio.component.html',
  styleUrl: './cabecera-sitio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabeceraSitioComponent {
  protected readonly auth = inject(AuthService);
  protected readonly enlaces = ENLACES_NAVEGACION;
}
