import { mapearJugador } from '@data-access/jugadores/jugador.mapper';
import type { Convocado } from './interfaces/convocado.interface';
import type { FilaConvocado } from './interfaces/fila-convocado.type';

/** Fila de `convocatoria` (con jugador) → `Convocado` de dominio. */
export function mapearConvocado(fila: FilaConvocado): Convocado {
  return {
    jugador: mapearJugador(fila.jugador),
    estado: fila.estado,
    nota: fila.nota,
  };
}

/** Convocados primero, luego dudas y descartados; dentro de cada grupo por dorsal. */
export function compararConvocados(a: Convocado, b: Convocado): number {
  const orden = { convocado: 0, duda: 1, descartado: 2 } as const;
  if (orden[a.estado] !== orden[b.estado]) {
    return orden[a.estado] - orden[b.estado];
  }
  return (a.jugador.dorsal ?? Infinity) - (b.jugador.dorsal ?? Infinity);
}
