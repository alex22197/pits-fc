import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TipoMensajeEstado } from './interfaces/tipo-mensaje-estado.type';

/** Aviso en el sitio de unos datos que cargan, han fallado o no existen todavía. */
@Component({
  selector: 'pits-mensaje-estado',
  templateUrl: './mensaje-estado.component.html',
  styleUrl: './mensaje-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeEstadoComponent {
  readonly tipo = input.required<TipoMensajeEstado>();
  readonly mensaje = input.required<string>();

  protected readonly rol = computed(() => (this.tipo() === 'error' ? 'alert' : 'status'));
}
