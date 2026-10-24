import type { GolEquipo } from './interfaces/gol-equipo.interface';
import type { GolesTramo } from './interfaces/goles-tramo.interface';

/** Un partido de fútbol 7 dura 50 minutos; el acta puede apuntar goles en el descuento. */
const ANCHO_TRAMO = 10;
const ULTIMO_TRAMO = 50;
export const TRAMO_SIN_MINUTO = 'Sin minuto';

/**
 * Goles a favor y en contra por tramo de diez minutos: «0-10», «10-20»… y «50+». Los goles
 * sin minuto en el acta van a un tramo aparte que solo aparece si hay alguno.
 */
export function golesPorTramo(goles: readonly GolEquipo[]): GolesTramo[] {
  const tramos: GolesTramo[] = [];
  for (let inicio = 0; inicio < ULTIMO_TRAMO; inicio += ANCHO_TRAMO) {
    tramos.push({ tramo: `${inicio}-${inicio + ANCHO_TRAMO}`, favor: 0, contra: 0 });
  }
  tramos.push({ tramo: `${ULTIMO_TRAMO}+`, favor: 0, contra: 0 });
  const sinMinuto = { tramo: TRAMO_SIN_MINUTO, favor: 0, contra: 0 };

  const contar = (destino: GolesTramo, gol: GolEquipo): GolesTramo => ({
    ...destino,
    favor: destino.favor + (gol.esNuestro ? 1 : 0),
    contra: destino.contra + (gol.esNuestro ? 0 : 1),
  });

  for (const gol of goles) {
    if (gol.minuto === null) {
      Object.assign(sinMinuto, contar(sinMinuto, gol));
      continue;
    }
    const indice = Math.min(Math.floor(Math.max(gol.minuto, 0) / ANCHO_TRAMO), tramos.length - 1);
    tramos[indice] = contar(tramos[indice], gol);
  }
  return sinMinuto.favor + sinMinuto.contra > 0 ? [...tramos, sinMinuto] : tramos;
}
