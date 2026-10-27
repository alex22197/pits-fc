import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Convocado } from '@data-access/convocatorias/interfaces/convocado.interface';
import { banquillo, titularesPorPuesto } from '@data-access/convocatorias/puestos';
import { CampoAlineacionComponent } from '../campo-alineacion/campo-alineacion.component';

/** La convocatoria publicada de un partido: la pizarra con los titulares y los demás grupos. */
@Component({
  selector: 'pits-convocatoria-partido',
  imports: [CampoAlineacionComponent],
  templateUrl: './convocatoria-partido.component.html',
  styleUrl: './convocatoria-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaPartidoComponent {
  readonly convocados = input.required<readonly Convocado[]>();

  protected readonly titulares = computed(() => titularesPorPuesto(this.convocados()));

  /** Sin titulares colocados, los convocados van en lista; con ellos, el resto es el banquillo. */
  protected readonly grupos = computed(() => {
    const convocados = this.convocados();
    const hayTitulares = this.titulares().size > 0;
    return [
      { etiqueta: hayTitulares ? 'Banquillo' : 'Convocados', jugadores: banquillo(convocados) },
      { etiqueta: 'Dudas', jugadores: convocados.filter((c) => c.estado === 'duda') },
      { etiqueta: 'No van', jugadores: convocados.filter((c) => c.estado === 'descartado') },
    ].filter((grupo) => grupo.jugadores.length > 0);
  });
}
