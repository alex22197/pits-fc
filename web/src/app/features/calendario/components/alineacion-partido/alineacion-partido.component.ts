import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Participante } from '@data-access/partidos/interfaces/participante.interface';

/** Quién jugó el partido según el acta: titulares y suplentes, con su dorsal. */
@Component({
  selector: 'pits-alineacion-partido',
  imports: [RouterLink],
  templateUrl: './alineacion-partido.component.html',
  styleUrl: './alineacion-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlineacionPartidoComponent {
  readonly participantes = input.required<readonly Participante[]>();

  protected readonly titulares = computed(() => this.participantes().filter((p) => p.titular));
  protected readonly suplentes = computed(() => this.participantes().filter((p) => !p.titular));
}
