import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CabeceraSitioComponent } from '@core/layout/components/cabecera-sitio/cabecera-sitio.component';
import { NavegacionInferiorComponent } from '@core/layout/components/navegacion-inferior/navegacion-inferior.component';

/** Esqueleto de la aplicación: cabecera, contenido de la ruta con su pie y navegación móvil. */
@Component({
  selector: 'pits-root',
  imports: [RouterLink, RouterOutlet, CabeceraSitioComponent, NavegacionInferiorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
