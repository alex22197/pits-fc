import { filaJugador } from '@data-access/jugadores/jugador.fixtures';
import type { FilaGolEquipo } from './interfaces/fila-gol-equipo.type';
import type { GolEquipo } from './interfaces/gol-equipo.interface';
import { mapearGolEquipo } from './gol-equipo.mapper';

export const NUESTRO_ID = 'equipo-pits';
export const RIVAL_ID = 'equipo-sparta';

/** Fila de `gol` para tests: gol nuestro en la jornada 2, minuto 24, 1-0. */
export function filaGolEquipo(cambios: Partial<FilaGolEquipo> = {}): FilaGolEquipo {
  return {
    id: 'gol-1',
    partido_id: 'partido-1',
    equipo_id: NUESTRO_ID,
    jugador_id: 'jugador-1',
    asistente_id: null,
    minuto: 24,
    marcador_local: 1,
    marcador_visitante: 0,
    created_at: '2026-10-24T10:00:00+00:00',
    partido: {
      id: 'partido-1',
      local_id: NUESTRO_ID,
      visitante_id: RIVAL_ID,
      jornada: { numero: 2 },
    },
    jugador: filaJugador(),
    ...cambios,
  };
}

/** Gol de dominio para tests, nuestro salvo que se indique el equipo del rival. */
export function golEquipo(cambios: Partial<FilaGolEquipo> = {}): GolEquipo {
  return mapearGolEquipo(filaGolEquipo(cambios), NUESTRO_ID);
}
