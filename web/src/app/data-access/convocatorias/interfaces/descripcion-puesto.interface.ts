import type { PuestoAlineacion } from './puesto-alineacion.type';

/** Cómo se llama un puesto de la alineación en la interfaz. */
export interface DescripcionPuesto {
  readonly puesto: PuestoAlineacion;
  /** «Lateral izquierdo». */
  readonly nombre: string;
  /** «Lateral izq.», debajo del hueco vacío de la pizarra. */
  readonly nombreCorto: string;
  /** «LI», dentro del hueco vacío. */
  readonly abreviatura: string;
}
