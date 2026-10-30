import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';

/** Dónde se suelta una ficha arrastrada: en un puesto o fuera del campo (sale de él). */
export type DestinoArrastre = PuestoAlineacion | 'fuera';
