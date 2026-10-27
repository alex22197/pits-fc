import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Convocado } from './interfaces/convocado.interface';
import type { DescripcionPuesto } from './interfaces/descripcion-puesto.interface';
import type { PuestoAlineacion } from './interfaces/puesto-alineacion.type';

/** Los siete puestos del 1-2-3-1, de la portería hacia delante. */
export const PUESTOS: readonly DescripcionPuesto[] = [
  { puesto: 'portero', nombre: 'Portero', nombreCorto: 'Portero', abreviatura: 'POR' },
  {
    puesto: 'central_izquierdo',
    nombre: 'Central izquierdo',
    nombreCorto: 'Central izq.',
    abreviatura: 'CI',
  },
  {
    puesto: 'central_derecho',
    nombre: 'Central derecho',
    nombreCorto: 'Central der.',
    abreviatura: 'CD',
  },
  {
    puesto: 'lateral_izquierdo',
    nombre: 'Lateral izquierdo',
    nombreCorto: 'Lateral izq.',
    abreviatura: 'LI',
  },
  { puesto: 'medio', nombre: 'Medio', nombreCorto: 'Medio', abreviatura: 'MC' },
  {
    puesto: 'lateral_derecho',
    nombre: 'Lateral derecho',
    nombreCorto: 'Lateral der.',
    abreviatura: 'LD',
  },
  { puesto: 'delantero', nombre: 'Delantero', nombreCorto: 'Delantero', abreviatura: 'DEL' },
];

export function nombreDelPuesto(puesto: PuestoAlineacion): string {
  return PUESTOS.find((p) => p.puesto === puesto)?.nombre ?? puesto;
}

/** Posición del puesto en el orden del 1-2-3-1, para ordenar titulares. */
export function ordenDelPuesto(puesto: PuestoAlineacion | null): number {
  const indice = PUESTOS.findIndex((p) => p.puesto === puesto);
  return indice === -1 ? PUESTOS.length : indice;
}

/** Quién ocupa cada puesto; los puestos vacíos no aparecen. */
export function titularesPorPuesto(
  convocados: readonly Convocado[],
): ReadonlyMap<PuestoAlineacion, Jugador> {
  const titulares = new Map<PuestoAlineacion, Jugador>();
  for (const convocado of convocados) {
    if (convocado.estado === 'convocado' && convocado.puesto !== null) {
      titulares.set(convocado.puesto, convocado.jugador);
    }
  }
  return titulares;
}

/** Convocados sin puesto: el banquillo. */
export function banquillo(convocados: readonly Convocado[]): Convocado[] {
  return convocados.filter((c) => c.estado === 'convocado' && c.puesto === null);
}
