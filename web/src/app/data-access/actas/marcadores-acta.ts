import type { Marcador } from '@data-access/partidos/interfaces/marcador.interface';
import type { GolActa } from './interfaces/gol-acta.interface';

/**
 * Los goles en orden de minuto (los que no tienen minuto, al final, en el orden apuntado) con
 * el marcador que dejó cada uno. Es lo que la tabla `gol` guarda en cada fila.
 */
export function marcadoresDeLosGoles(
  goles: readonly GolActa[],
  somosLocal: boolean,
): { readonly gol: GolActa; readonly marcador: Marcador }[] {
  let local = 0;
  let visitante = 0;
  return ordenarGoles(goles).map((gol) => {
    if (gol.nuestro === somosLocal) {
      local += 1;
    } else {
      visitante += 1;
    }
    return { gol, marcador: { local, visitante } };
  });
}

/** Por minuto; sin minuto, al final y en el orden en que estaban. */
export function ordenarGoles(goles: readonly GolActa[]): GolActa[] {
  return goles
    .map((gol, indice) => ({ gol, indice }))
    .sort((a, b) => (a.gol.minuto ?? Infinity) - (b.gol.minuto ?? Infinity) || a.indice - b.indice)
    .map(({ gol }) => gol);
}

/** Cuántos goles nuestros y del rival hay apuntados. */
export function contarGoles(goles: readonly GolActa[]): { nuestros: number; rival: number } {
  const nuestros = goles.filter((gol) => gol.nuestro).length;
  return { nuestros, rival: goles.length - nuestros };
}
