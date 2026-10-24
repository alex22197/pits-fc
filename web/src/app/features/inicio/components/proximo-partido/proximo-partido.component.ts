import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';

/** El próximo partido en grande: rival, cuándo y dónde. */
@Component({
  selector: 'pits-proximo-partido',
  imports: [FechaPartidoPipe],
  templateUrl: './proximo-partido.component.html',
  styleUrl: './proximo-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProximoPartidoComponent {
  readonly partido = input.required<Partido>();

  protected readonly rival = computed(() => {
    const partido = this.partido();
    return partido.local.esNuestro ? partido.visitante.nombre : partido.local.nombre;
  });
  protected readonly enCasa = computed(() => this.partido().local.esNuestro);
}
