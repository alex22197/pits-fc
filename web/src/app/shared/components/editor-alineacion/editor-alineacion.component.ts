import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { PUESTOS, nombreDelPuesto } from '@data-access/convocatorias/puestos';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Alineacion } from '@shared/utils/alineacion/interfaces/alineacion.type';
import {
  colocarEnAlineacion,
  puestoDe,
  sacarDeAlineacion,
} from '@shared/utils/alineacion/mover-en-alineacion';
import { CampoAlineacionComponent } from '../campo-alineacion/campo-alineacion.component';
import { AnimacionesEditor } from './animaciones-editor';
import type { DestinoArrastre } from './interfaces/destino-arrastre.type';
import type { SeleccionPizarra } from './interfaces/seleccion-pizarra.type';

/**
 * Colocar a unos jugadores en el 1-2-3-1: tocar un jugador y un hueco (en cualquier orden) o
 * arrastrar su ficha. Entre dos del campo se intercambian; fuera del campo, sale. Cada ficha
 * vuela a su sitio. Solo avisa de la alineación nueva: guardar es cosa de quien lo usa.
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
  readonly titulares = input.required<Alineacion>();
  readonly cambio = output<Alineacion>();

  private readonly campo = viewChild.required(CampoAlineacionComponent);
  private readonly injector = inject(Injector);
  private readonly animaciones = new AnimacionesEditor(
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
  );

  protected readonly seleccion = signal<SeleccionPizarra | null>(null);
  protected readonly porColocar = computed(() => {
    const enCampo = new Set([...this.titulares().values()].map((jugador) => jugador.id));
    return this.candidatos().filter((jugador) => !enCampo.has(jugador.id));
  });
  protected readonly puestoActivo = computed(() => {
    const seleccion = this.seleccion();
    return seleccion?.tipo === 'puesto' ? seleccion.puesto : null;
  });
  protected readonly jugadorElegido = computed(() => {
    const seleccion = this.seleccion();
    return seleccion?.tipo === 'jugador' ? seleccion.jugadorId : null;
  });
  protected readonly elegidoEnCampo = computed(() => {
    const id = this.jugadorElegido();
    return id !== null && puestoDe(this.titulares(), id) !== null;
  });
  protected readonly ayuda = computed(() => this.textoAyuda());

  constructor() {
    // Cada vez que cambian las fichas pintadas, se vuelven a hacer arrastrables.
    effect(() => {
      this.porColocar();
      this.titulares();
      afterNextRender(
        () =>
          this.animaciones.prepararArrastre((id, destino, ficha) =>
            this.soltar(id, destino, ficha),
          ),
        { injector: this.injector },
      );
    });
    inject(DestroyRef).onDestroy(() => this.animaciones.destruir());
  }

  protected pulsarJugador(jugador: Jugador): void {
    const puesto = this.puestoActivo();
    if (puesto) {
      this.aplicar(colocarEnAlineacion(this.titulares(), jugador, puesto), puesto);
      return;
    }
    this.seleccion.update((actual) =>
      actual?.tipo === 'jugador' && actual.jugadorId === jugador.id
        ? null
        : { tipo: 'jugador', jugadorId: jugador.id },
    );
  }

  protected pulsarPuesto(puesto: PuestoAlineacion): void {
    const seleccion = this.seleccion();
    const ocupante = this.titulares().get(puesto);
    if (seleccion?.tipo === 'jugador') {
      if (ocupante?.id === seleccion.jugadorId) {
        this.seleccion.set(null);
        return;
      }
      const jugador = this.buscar(seleccion.jugadorId);
      if (jugador) {
        this.aplicar(colocarEnAlineacion(this.titulares(), jugador, puesto), puesto);
      }
    } else if (seleccion?.tipo === 'puesto' && seleccion.puesto === puesto) {
      this.seleccion.set(null);
    } else if (ocupante) {
      this.seleccion.set({ tipo: 'jugador', jugadorId: ocupante.id });
    } else {
      this.seleccion.set({ tipo: 'puesto', puesto });
    }
  }

  protected sacarElegido(): void {
    const id = this.jugadorElegido();
    if (id) {
      this.aplicar(sacarDeAlineacion(this.titulares(), id), null);
    }
  }

  private soltar(jugadorId: string, destino: DestinoArrastre, ficha: HTMLElement): void {
    const jugador = this.buscar(jugadorId);
    if (!jugador) {
      return;
    }
    const nueva =
      destino === 'fuera'
        ? sacarDeAlineacion(this.titulares(), jugadorId)
        : colocarEnAlineacion(this.titulares(), jugador, destino);
    this.aplicar(nueva, destino === 'fuera' ? null : destino, ficha);
  }

  /** Avisa del cambio y, cuando ya está pintado, hace volar las fichas a su sitio. */
  private aplicar(
    nueva: Alineacion,
    destino: PuestoAlineacion | null,
    soltada?: HTMLElement,
  ): void {
    const estado = this.animaciones.capturar();
    if (soltada) {
      this.animaciones.soltar(soltada);
    }
    this.seleccion.set(null);
    this.cambio.emit(nueva);
    afterNextRender(
      () => this.animaciones.volar(estado, () => destino && this.campo().onda(destino)),
      { injector: this.injector },
    );
  }

  private buscar(jugadorId: string): Jugador | undefined {
    return this.candidatos().find((jugador) => jugador.id === jugadorId);
  }

  private textoAyuda(): string {
    const puesto = this.puestoActivo();
    const elegido = this.jugadorElegido();
    if (puesto) {
      return `¿Quién juega de ${nombreDelPuesto(puesto).toLowerCase()}? Toca su ficha.`;
    }
    if (elegido) {
      const nombre = this.buscar(elegido)?.nombreMostrar ?? 'el jugador';
      return this.elegidoEnCampo()
        ? `Toca otro hueco para mover a ${nombre} o sácalo del campo.`
        : `Toca el hueco donde juega ${nombre}.`;
    }
    const colocados = this.titulares().size;
    return colocados === PUESTOS.length
      ? 'Los siete, en su sitio.'
      : `Toca un jugador y su hueco, o arrastra su ficha al campo (${colocados} de 7).`;
  }
}
