import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeccionEnConstruccionComponent } from '@shared/components/seccion-en-construccion/seccion-en-construccion.component';

/** Clasificación del grupo (pendiente de datos). */
@Component({
  selector: 'pits-clasificacion-page',
  imports: [SeccionEnConstruccionComponent],
  templateUrl: './clasificacion-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionPageComponent {}
