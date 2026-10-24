import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';

const LETRAS: Readonly<Record<ResultadoPartido, string>> = {
  victoria: 'V',
  empate: 'E',
  derrota: 'D',
};

/** Últimos resultados como fichas con letra y color: nunca solo color. */
@Component({
  selector: 'pits-racha',
  templateUrl: './racha.component.html',
  styleUrl: './racha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RachaComponent {
  readonly resultados = input.required<readonly ResultadoPartido[]>();
  /** `pequena` para dentro de una tabla. */
  readonly tamano = input<'normal' | 'pequena'>('normal');

  protected readonly fichas = computed(() =>
    this.resultados().map((resultado) => ({ resultado, letra: LETRAS[resultado] })),
  );
}
