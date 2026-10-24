import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeccionEnConstruccionComponent } from '@shared/components/seccion-en-construccion/seccion-en-construccion.component';

/** Plantilla del equipo con la ficha de cada jugador (pendiente de datos). */
@Component({
  selector: 'pits-plantilla-page',
  imports: [SeccionEnConstruccionComponent],
  templateUrl: './plantilla-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantillaPageComponent {}
