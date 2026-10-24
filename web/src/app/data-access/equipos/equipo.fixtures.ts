import type { FilaEquipo } from './interfaces/fila-equipo.type';

/** Fila de `equipo` para tests, con valores por defecto que se pueden sobrescribir. */
export function filaEquipo(cambios: Partial<FilaEquipo> = {}): FilaEquipo {
  return {
    id: 'equipo-pits',
    nombre: 'PITS FC',
    nombre_federacion: 'PITS',
    cod_equipo: '326330',
    es_nuestro: true,
    created_at: '2026-10-24T10:00:00+00:00',
    updated_at: '2026-10-24T10:00:00+00:00',
    ...cambios,
  };
}
