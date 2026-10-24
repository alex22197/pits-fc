import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Aviso para las secciones que aún no tienen contenido. Se quita de cada página en cuanto
 * se construye (ver docs/hoja-de-ruta.md).
 */
@Component({
  selector: 'pits-seccion-en-construccion',
  templateUrl: './seccion-en-construccion.component.html',
  styleUrl: './seccion-en-construccion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeccionEnConstruccionComponent {
  readonly titulo = input.required<string>();
  readonly descripcion = input.required<string>();
}
