import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Convocado } from '@data-access/convocatorias/interfaces/convocado.interface';

const ETIQUETAS = { convocado: 'Convocados', duda: 'Dudas', descartado: 'No van' } as const;

/** La convocatoria publicada de un partido, por grupos. */
@Component({
  selector: 'pits-convocatoria-partido',
  templateUrl: './convocatoria-partido.component.html',
  styleUrl: './convocatoria-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaPartidoComponent {
  readonly convocados = input.required<readonly Convocado[]>();

  protected readonly grupos = computed(() =>
    (['convocado', 'duda', 'descartado'] as const)
      .map((estado) => ({
        etiqueta: ETIQUETAS[estado],
        jugadores: this.convocados().filter((convocado) => convocado.estado === estado),
      }))
      .filter((grupo) => grupo.jugadores.length > 0),
  );
}
