import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Participante } from '@data-access/partidos/interfaces/participante.interface';
import { CampoAlineacionComponent } from '@shared/components/campo-alineacion/campo-alineacion.component';
import { EditorAlineacionComponent } from '@shared/components/editor-alineacion/editor-alineacion.component';
import type { Alineacion } from '@shared/utils/alineacion/interfaces/alineacion.type';

/**
 * Quién jugó el partido según el acta: la pizarra con los titulares colocados y, en lista,
 * los que faltan por colocar y los suplentes. Un gestor la edita aquí mismo: si aún no hay
 * alineación, la pizarra ya sale editable.
 */
@Component({
  selector: 'pits-alineacion-partido',
  imports: [RouterLink, CampoAlineacionComponent, EditorAlineacionComponent],
  templateUrl: './alineacion-partido.component.html',
  styleUrl: './alineacion-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlineacionPartidoComponent {
  readonly participantes = input.required<readonly Participante[]>();
  readonly puedeColocar = input(false);
  readonly guardando = input(false);
  readonly error = input<string | null>(null);
  readonly guardar = output<Alineacion>();

  protected readonly colocados = computed<Alineacion>(() => {
    const titulares = new Map<PuestoAlineacion, Jugador>();
    for (const participante of this.participantes()) {
      if (participante.titular && participante.puesto !== null) {
        titulares.set(participante.puesto, participante.jugador);
      }
    }
    return titulares;
  });
  protected readonly titularesActa = computed(() =>
    this.participantes()
      .filter((p) => p.titular)
      .map((p) => p.jugador),
  );
  protected readonly sinColocar = computed(() =>
    this.participantes().filter((p) => p.titular && p.puesto === null),
  );
  protected readonly suplentes = computed(() => this.participantes().filter((p) => !p.titular));

  /** Sin alineación todavía, un gestor empieza ya editando; al guardar, vuelve a verla. */
  protected readonly editando = linkedSignal(
    () => this.puedeColocar() && this.colocados().size === 0,
  );
  protected readonly borrador = linkedSignal<Alineacion>(() => this.colocados());

  protected cancelar(): void {
    this.borrador.set(this.colocados());
    this.editando.set(false);
  }
}
