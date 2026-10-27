import type { FilaJugador } from './interfaces/fila-jugador.type';

/** Fila de `jugador` para tests, con valores por defecto que se pueden sobrescribir. */
export function filaJugador(cambios: Partial<FilaJugador> = {}): FilaJugador {
  return {
    id: 'jugador-1',
    nombre_mostrar: 'Carlos',
    dorsal: 10,
    posicion: 'delantero',
    activo: true,
    created_at: '2026-10-24T10:00:00+00:00',
    updated_at: '2026-10-24T10:00:00+00:00',
    ...cambios,
  };
}
