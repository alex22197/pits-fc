import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AvisoActualizacionComponent } from '@core/layout/components/aviso-actualizacion/aviso-actualizacion.component';
import { CabeceraSitioComponent } from '@core/layout/components/cabecera-sitio/cabecera-sitio.component';
import { NavegacionInferiorComponent } from '@core/layout/components/navegacion-inferior/navegacion-inferior.component';
import { ImportacionService } from '@data-access/importacion/importacion.service';
import { calcularProximaImportacion } from '@data-access/importacion/proxima-importacion';

/** Esqueleto de la aplicación: cabecera, contenido de la ruta con su pie y navegación móvil. */
@Component({
  selector: 'pits-root',
  imports: [
    RouterLink,
    RouterOutlet,
    AvisoActualizacionComponent,
    CabeceraSitioComponent,
    NavegacionInferiorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly importacion = inject(ImportacionService);

  protected readonly ahora = new Date();
  protected readonly proximaImportacion = calcularProximaImportacion(this.ahora);
  /** Si falla, el pie solo dice cuándo será la próxima: no merece un mensaje de error. */
  protected readonly ultimaImportacion = resource({
    loader: () => this.importacion.obtenerUltimaImportacion(),
  });
}
