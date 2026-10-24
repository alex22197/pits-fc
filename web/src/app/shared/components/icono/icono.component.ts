import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { NombreIcono } from './interfaces/nombre-icono.type';

/**
 * Icono decorativo que toma el color del texto que lo rodea. El dibujo está en
 * `public/iconos/<nombre>.svg` y se aplica como máscara CSS.
 */
@Component({
  selector: 'pits-icono',
  templateUrl: './icono.component.html',
  styleUrl: './icono.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconoComponent {
  readonly nombre = input.required<NombreIcono>();

  protected readonly mascara = computed(() => `url('/iconos/${this.nombre()}.svg')`);
}
