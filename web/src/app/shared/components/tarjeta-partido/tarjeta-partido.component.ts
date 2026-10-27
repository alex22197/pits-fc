import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import { resultadoParaNosotros } from '@data-access/partidos/resultado-partido';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';

const ESTADOS: Readonly<Record<Partido['estado'], string | null>> = {
  programado: null,
  jugado: null,
  aplazado: 'Aplazado',
  suspendido: 'Suspendido',
};

/**
 * Un partido en una línea: equipos, marcador u hora, campo. Los nuestros se destacan y, si
 * están jugados, llevan el color del resultado y enlazan a su detalle.
 */
@Component({
  selector: 'pits-tarjeta-partido',
  imports: [RouterLink, FechaPartidoPipe],
  templateUrl: './tarjeta-partido.component.html',
  styleUrl: './tarjeta-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaPartidoComponent {
  readonly partido = input.required<Partido>();
  /** `true` para mostrar «Jornada N» (en la portada, donde no hay cabecera de jornada). */
  readonly conJornada = input<boolean>(false);
  /** `false` en la propia página del partido, donde el enlace al acta sobra. */
  readonly enlazar = input<boolean>(true);

  protected readonly resultado = computed(() => resultadoParaNosotros(this.partido()));
  protected readonly estado = computed(() => ESTADOS[this.partido().estado]);
  protected readonly enlazable = computed(
    () => this.enlazar() && this.partido().esNuestro && this.partido().estado === 'jugado',
  );
}
