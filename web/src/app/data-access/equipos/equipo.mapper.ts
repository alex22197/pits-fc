import type { Equipo } from './interfaces/equipo.interface';
import type { FilaEquipo } from './interfaces/fila-equipo.type';

/** Fila de `equipo` → `Equipo` de dominio. */
export function mapearEquipo(fila: FilaEquipo): Equipo {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nombreFederacion: fila.nombre_federacion,
    esNuestro: fila.es_nuestro,
  };
}
