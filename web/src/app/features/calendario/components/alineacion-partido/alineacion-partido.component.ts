import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Participante } from '@data-access/partidos/interfaces/participante.interface';
import { CampoAlineacionComponent } from '@shared/components/campo-alineacion/campo-alineacion.component';

/**
 * Quién jugó el partido según el acta: los titulares en la pizarra (los que un gestor haya
 * colocado) y en lista los que faltan por colocar y los suplentes.
 */
@Component({
  selector: 'pits-alineacion-partido',
  imports: [RouterLink, CampoAlineacionComponent],
  templateUrl: './alineacion-partido.component.html',
  styleUrl: './alineacion-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlineacionPartidoComponent {
  readonly participantes = input.required<readonly Participante[]>();
  readonly partidoId = input.required<string>();
  /** Un gestor ve el enlace para colocar a los titulares. */
  readonly puedeColocar = input(false);

  protected readonly colocados = computed(() => {
    const titulares = new Map<PuestoAlineacion, Jugador>();
    for (const participante of this.participantes()) {
      if (participante.titular && participante.puesto !== null) {
        titulares.set(participante.puesto, participante.jugador);
      }
    }
    return titulares;
  });
  protected readonly sinColocar = computed(() =>
    this.participantes().filter((p) => p.titular && p.puesto === null),
  );
  protected readonly suplentes = computed(() => this.participantes().filter((p) => !p.titular));
}
