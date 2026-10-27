import { mapearJugador } from '@data-access/jugadores/jugador.mapper';
import type { Convocado } from './interfaces/convocado.interface';
import type { FilaConvocado } from './interfaces/fila-convocado.type';
import { ordenDelPuesto } from './puestos';

/** Fila de `convocatoria` (con jugador) → `Convocado` de dominio. */
export function mapearConvocado(fila: FilaConvocado): Convocado {
  return {
    jugador: mapearJugador(fila.jugador),
    estado: fila.estado,
    puesto: fila.estado === 'convocado' ? fila.puesto : null,
    nota: fila.nota,
  };
}

/**
 * Titulares en el orden del 1-2-3-1, luego el banquillo, las dudas y los descartados; dentro
 * de cada grupo por dorsal.
 */
export function compararConvocados(a: Convocado, b: Convocado): number {
  const orden = { convocado: 0, duda: 1, descartado: 2 } as const;
  if (orden[a.estado] !== orden[b.estado]) {
    return orden[a.estado] - orden[b.estado];
  }
  if (a.puesto !== b.puesto) {
    return ordenDelPuesto(a.puesto) - ordenDelPuesto(b.puesto);
  }
  return (a.jugador.dorsal ?? Infinity) - (b.jugador.dorsal ?? Infinity);
}
