import { mapearEquipo } from '@data-access/equipos/equipo.mapper';
import type { FilaJornada } from './interfaces/fila-jornada.type';
import type { Jornada } from './interfaces/jornada.interface';
import type { Partido } from './interfaces/partido.interface';
import { mapearPartido } from './partido.mapper';

/** Fila de `jornada` (con descanso y partidos) → `Jornada` de dominio, partidos por fecha. */
export function mapearJornada(fila: FilaJornada): Jornada {
  const partidos = fila.partidos
    .map((partido) => mapearPartido(partido, fila))
    .sort(compararPorFecha);
  return {
    id: fila.id,
    numero: fila.numero,
    vuelta: fila.vuelta === 2 ? 2 : 1,
    fechaPrevista: fila.fecha_prevista,
    descansa: fila.descansa ? mapearEquipo(fila.descansa) : null,
    partidos,
  };
}

/** Primero los que tienen hora, por hora; los demás al final en orden estable. */
function compararPorFecha(a: Partido, b: Partido): number {
  if (a.fechaHora && b.fechaHora) {
    return a.fechaHora.getTime() - b.fechaHora.getTime();
  }
  if (a.fechaHora) {
    return -1;
  }
  return b.fechaHora ? 1 : 0;
}
