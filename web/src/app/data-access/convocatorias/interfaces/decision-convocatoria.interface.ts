import type { EstadoConvocatoria } from './estado-convocatoria.type';
import type { PuestoAlineacion } from './puesto-alineacion.type';

/** Lo que un gestor decide de un jugador para un partido. */
export interface DecisionConvocatoria {
  readonly jugadorId: string;
  readonly estado: EstadoConvocatoria;
  /** Solo con `estado` convocado: su puesto si es titular. */
  readonly puesto: PuestoAlineacion | null;
  readonly nota: string | null;
}
