import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Jornada } from '@data-access/partidos/interfaces/jornada.interface';
import { TarjetaPartidoComponent } from '@shared/components/tarjeta-partido/tarjeta-partido.component';
import { formatearFechaPrevista } from '@shared/utils/fechas/formatear-fecha';

/** Una jornada del calendario: cabecera con fecha y descanso, y sus partidos. */
@Component({
  selector: 'pits-lista-jornada',
  imports: [TarjetaPartidoComponent],
  templateUrl: './lista-jornada.component.html',
  styleUrl: './lista-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaJornadaComponent {
  readonly jornada = input.required<Jornada>();
  readonly actual = input<boolean>(false);

  protected readonly fecha = computed(() => formatearFechaPrevista(this.jornada().fechaPrevista));
}
