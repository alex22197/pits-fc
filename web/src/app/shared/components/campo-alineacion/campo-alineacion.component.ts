import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { PUESTOS } from '@data-access/convocatorias/puestos';
import type { Alineacion } from '@shared/utils/alineacion/interfaces/alineacion.type';
import { AnimacionesCampo } from './animaciones-campo';
import type { HuecoCampo } from './interfaces/hueco-campo.interface';

/** Dónde va cada puesto del 1-2-3-1 sobre la pizarra, en % (atacamos hacia arriba). */
const COORDENADAS: Readonly<Record<PuestoAlineacion, readonly [number, number]>> = {
  portero: [50, 88],
  central_izquierdo: [29, 68],
  central_derecho: [71, 68],
  lateral_izquierdo: [15, 44],
  medio: [50, 48],
  lateral_derecho: [85, 44],
  delantero: [50, 17],
};

/**
 * La pizarra: un campo de fútbol 7 con los siete puestos del 1-2-3-1 y quién ocupa cada uno.
 * Solo muestra; si es interactiva, cada puesto es un botón y avisa de cuál se pulsa. Se anima
 * sola al aparecer, cuando llega alguien y cuando se completan los siete (ADR 0008).
 */
@Component({
  selector: 'pits-campo-alineacion',
  imports: [NgTemplateOutlet],
  templateUrl: './campo-alineacion.component.html',
  styleUrl: './campo-alineacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoAlineacionComponent {
  readonly titulares = input.required<Alineacion>();
  readonly interactivo = input(false);
  /** El puesto que se está decidiendo ahora mismo. */
  readonly puestoActivo = input<PuestoAlineacion | null>(null);
  /** Hay un jugador esperando sitio: los huecos libres se ofrecen. */
  readonly ofrecerHuecos = input(false);
  /** Jugador elegido para moverlo: su ficha se levanta. */
  readonly jugadorResaltado = input<string | null>(null);
  /** Quien la usa anima él mismo las llegadas (vuelan desde fuera): aquí solo se celebran. */
  readonly vuelos = input(false);
  readonly puestoPulsado = output<PuestoAlineacion>();

  private readonly injector = inject(Injector);
  private readonly animaciones = new AnimacionesCampo(
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
  );
  private anteriores: Alineacion | null = null;

  protected readonly huecos = computed<readonly HuecoCampo[]>(() =>
    PUESTOS.map((descripcion) => {
      const [x, y] = COORDENADAS[descripcion.puesto];
      return { ...descripcion, x, y, jugador: this.titulares().get(descripcion.puesto) ?? null };
    }),
  );

  constructor() {
    afterNextRender(() => this.animaciones.entrada());
    effect(() => {
      const actuales = this.titulares();
      const anteriores = this.anteriores;
      this.anteriores = actuales;
      if (anteriores === null) {
        return;
      }
      const llegadas = [...actuales]
        .filter(([puesto, jugador]) => anteriores.get(puesto)?.id !== jugador.id)
        .map(([puesto]) => puesto);
      const completa = actuales.size === PUESTOS.length && anteriores.size < PUESTOS.length;
      if (llegadas.length === 0 && !completa) {
        return;
      }
      afterNextRender(
        () => {
          if (!this.vuelos()) {
            this.animaciones.llegadas(llegadas);
          }
          if (completa) {
            this.animaciones.celebrar(this.vuelos() ? 0.6 : 0.35);
          }
        },
        { injector: this.injector },
      );
    });
  }

  /** Para quien anima los vuelos: la onda de tiza cuando su ficha aterriza. */
  onda(puesto: PuestoAlineacion): void {
    this.animaciones.onda(puesto);
  }

  protected etiqueta(hueco: HuecoCampo): string {
    return hueco.jugador
      ? `${hueco.nombre}: ${hueco.jugador.nombreMostrar}`
      : `${hueco.nombre}: sin asignar`;
  }
}
