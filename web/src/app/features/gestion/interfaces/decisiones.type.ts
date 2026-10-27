import type { DecisionConvocatoria } from '@data-access/convocatorias/interfaces/decision-convocatoria.interface';

/** Lo decidido para cada jugador (por id) en el formulario de la alineación. */
export type Decisiones = ReadonlyMap<string, DecisionConvocatoria>;
