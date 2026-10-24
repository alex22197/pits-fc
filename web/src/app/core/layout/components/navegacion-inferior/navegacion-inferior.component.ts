import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { ENLACES_NAVEGACION } from '../../enlaces-navegacion';

/** Barra de secciones fija abajo, solo en móvil. */
@Component({
  selector: 'pits-navegacion-inferior',
  imports: [RouterLink, RouterLinkActive, IconoComponent],
  templateUrl: './navegacion-inferior.component.html',
  styleUrl: './navegacion-inferior.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavegacionInferiorComponent {
  protected readonly enlaces = ENLACES_NAVEGACION;
}
