import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { PUESTOS } from '@data-access/convocatorias/puestos';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
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
 * Solo muestra; si es interactiva, cada puesto es un botón y avisa de cuál se pulsa.
 */
@Component({
  selector: 'pits-campo-alineacion',
  imports: [NgTemplateOutlet],
  templateUrl: './campo-alineacion.component.html',
  styleUrl: './campo-alineacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoAlineacionComponent {
  readonly titulares = input.required<ReadonlyMap<PuestoAlineacion, Jugador>>();
  readonly interactivo = input(false);
  /** El puesto que se está decidiendo ahora mismo. */
  readonly puestoActivo = input<PuestoAlineacion | null>(null);
  /** Hay un jugador esperando sitio: los huecos libres se ofrecen. */
  readonly ofrecerHuecos = input(false);
  readonly puestoPulsado = output<PuestoAlineacion>();

  protected readonly huecos = computed<readonly HuecoCampo[]>(() =>
    PUESTOS.map((descripcion) => {
      const [x, y] = COORDENADAS[descripcion.puesto];
      return { ...descripcion, x, y, jugador: this.titulares().get(descripcion.puesto) ?? null };
    }),
  );

  protected etiqueta(hueco: HuecoCampo): string {
    return hueco.jugador
      ? `${hueco.nombre}: ${hueco.jugador.nombreMostrar}`
      : `${hueco.nombre}: sin asignar`;
  }
}
