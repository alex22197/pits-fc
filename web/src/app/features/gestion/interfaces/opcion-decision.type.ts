import type { EstadoConvocatoria } from '@data-access/convocatorias/interfaces/estado-convocatoria.type';

/** Lo que el gestor elige para un jugador en el desplegable: titular va aparte del estado. */
export type OpcionDecision = EstadoConvocatoria | 'titular' | '';
