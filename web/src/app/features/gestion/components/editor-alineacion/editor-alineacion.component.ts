import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { nombreDelPuesto } from '@data-access/convocatorias/puestos';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import { CampoAlineacionComponent } from '@shared/components/campo-alineacion/campo-alineacion.component';

/**
 * La pizarra interactiva para colocar a unos jugadores dados en los siete puestos: se toca un
 * hueco y se elige entre los candidatos. Avisa de cada cambio con la alineación completa.
 */
@Component({
  selector: 'pits-editor-alineacion',
  imports: [CampoAlineacionComponent],
  templateUrl: './editor-alineacion.component.html',
  styleUrl: './editor-alineacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorAlineacionComponent {
  readonly candidatos = input.required<readonly Jugador[]>();
  readonly titulares = input.required<ReadonlyMap<PuestoAlineacion, Jugador>>();
  readonly cambio = output<ReadonlyMap<PuestoAlineacion, Jugador>>();

  protected readonly puestoActivo = signal<PuestoAlineacion | null>(null);

  protected readonly ocupante = computed(() => {
    const puesto = this.puestoActivo();
    return puesto ? (this.titulares().get(puesto) ?? null) : null;
  });

  protected readonly ayuda = computed(() => {
    const puesto = this.puestoActivo();
    if (puesto) {
      const ocupante = this.ocupante();
      return ocupante
        ? `${ocupante.nombreMostrar} juega de ${nombreDelPuesto(puesto).toLowerCase()}. Elige a otro o deja el puesto libre.`
        : `¿Quién juega de ${nombreDelPuesto(puesto).toLowerCase()}?`;
    }
    const colocados = this.titulares().size;
    return colocados === this.candidatos().length
      ? 'Todos los titulares están colocados.'
      : `Toca un hueco de la pizarra para colocar a un titular (${colocados} de ${this.candidatos().length}).`;
  });

  /** Para el puesto activo: los candidatos menos quien ya lo ocupa, diciendo dónde juega cada uno. */
  protected readonly opciones = computed(() => {
    const ocupante = this.ocupante();
    const puestoDe = new Map(
      [...this.titulares()].map(([puesto, jugador]) => [jugador.id, puesto]),
    );
    return this.candidatos()
      .filter((jugador) => jugador.id !== ocupante?.id)
      .map((jugador) => {
        const puesto = puestoDe.get(jugador.id);
        return {
          jugador,
          situacion: puesto ? `Juega de ${nombreDelPuesto(puesto).toLowerCase()}` : '',
        };
      });
  });

  protected pulsarPuesto(puesto: PuestoAlineacion): void {
    this.puestoActivo.update((actual) => (actual === puesto ? null : puesto));
  }

  protected elegir(jugador: Jugador): void {
    const puesto = this.puestoActivo();
    if (!puesto) {
      return;
    }
    const nuevo = new Map(
      [...this.titulares()].filter(([, ocupante]) => ocupante.id !== jugador.id),
    );
    nuevo.set(puesto, jugador);
    this.cambio.emit(nuevo);
    this.puestoActivo.set(null);
  }

  protected dejarLibre(): void {
    const puesto = this.puestoActivo();
    if (puesto) {
      const nuevo = new Map(this.titulares());
      nuevo.delete(puesto);
      this.cambio.emit(nuevo);
    }
    this.puestoActivo.set(null);
  }

  protected cancelar(): void {
    this.puestoActivo.set(null);
  }
}
