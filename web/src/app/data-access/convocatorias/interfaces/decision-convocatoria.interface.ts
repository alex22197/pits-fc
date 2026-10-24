import type { EstadoConvocatoria } from './estado-convocatoria.type';

/** Lo que un gestor decide de un jugador para un partido. */
export interface DecisionConvocatoria {
  readonly jugadorId: string;
  readonly estado: EstadoConvocatoria;
  readonly nota: string | null;
}
