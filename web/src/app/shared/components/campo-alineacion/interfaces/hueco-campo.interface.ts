import type { DescripcionPuesto } from '@data-access/convocatorias/interfaces/descripcion-puesto.interface';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Un puesto dibujado en la pizarra: dónde está (en % del campo) y quién lo ocupa. */
export interface HuecoCampo extends DescripcionPuesto {
  readonly x: number;
  readonly y: number;
  readonly jugador: Jugador | null;
}
