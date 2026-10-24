import type { FilaJugador } from './interfaces/fila-jugador.type';
import type { Jugador } from './interfaces/jugador.interface';

/** Fila de `jugador` → `Jugador` de dominio. */
export function mapearJugador(fila: FilaJugador): Jugador {
  return {
    id: fila.id,
    nombreMostrar: fila.nombre_mostrar,
    dorsal: fila.dorsal,
    posicion: fila.posicion,
    activo: fila.activo,
  };
}
