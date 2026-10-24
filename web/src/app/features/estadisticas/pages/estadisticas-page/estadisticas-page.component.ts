import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeccionEnConstruccionComponent } from '@shared/components/seccion-en-construccion/seccion-en-construccion.component';

/** Estadísticas del equipo y de cada jugador (pendiente de datos). */
@Component({
  selector: 'pits-estadisticas-page',
  imports: [SeccionEnConstruccionComponent],
  templateUrl: './estadisticas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent {}
