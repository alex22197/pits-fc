import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeccionEnConstruccionComponent } from '@shared/components/seccion-en-construccion/seccion-en-construccion.component';

/** Calendario de la liga con resultados y próximos partidos (pendiente de datos). */
@Component({
  selector: 'pits-calendario-page',
  imports: [SeccionEnConstruccionComponent],
  templateUrl: './calendario-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioPageComponent {}
