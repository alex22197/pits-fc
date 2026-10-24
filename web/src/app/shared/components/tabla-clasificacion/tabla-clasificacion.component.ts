import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import { RachaComponent } from '@shared/components/racha/racha.component';
import { formatearDia } from '@shared/utils/fechas/formatear-fecha';

/**
 * La clasificación del grupo. Completa, o resumida (los primeros puestos y el nuestro) para
 * la portada. Nuestra fila va destacada.
 */
@Component({
  selector: 'pits-tabla-clasificacion',
  imports: [RachaComponent],
  templateUrl: './tabla-clasificacion.component.html',
  styleUrl: './tabla-clasificacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaClasificacionComponent {
  readonly filas = input.required<readonly FilaClasificacion[]>();
  /** Número de puestos a mostrar en la versión resumida; `0` para la tabla entera. */
  readonly primeros = input<number>(0);

  protected readonly visibles = computed(() => elegirFilas(this.filas(), this.primeros()));
  protected readonly haySalto = computed(() => this.visibles().length < this.filas().length);
  protected readonly actualizada = computed(() => {
    const fecha = this.filas()[0]?.actualizadoEn;
    return fecha ? formatearDia(fecha) : null;
  });
}

/** Los `primeros` puestos más el nuestro si queda fuera; todo si `primeros` es 0. */
export function elegirFilas(
  filas: readonly FilaClasificacion[],
  primeros: number,
): FilaClasificacion[] {
  if (primeros <= 0 || filas.length <= primeros) {
    return [...filas];
  }
  const cabeza = filas.slice(0, primeros);
  const nuestra = filas.find((fila) => fila.equipo.esNuestro);
  return nuestra && !cabeza.includes(nuestra) ? [...cabeza, nuestra] : cabeza;
}
