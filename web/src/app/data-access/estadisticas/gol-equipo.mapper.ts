import { mapearJugador } from '@data-access/jugadores/jugador.mapper';
import type { FilaGolEquipo } from './interfaces/fila-gol-equipo.type';
import type { GolEquipo } from './interfaces/gol-equipo.interface';

/** Fila de `gol` (con partido y autor) → `GolEquipo`; hace falta saber qué equipo es el nuestro. */
export function mapearGolEquipo(fila: FilaGolEquipo, nuestroEquipoId: string): GolEquipo {
  return {
    id: fila.id,
    partidoId: fila.partido.id,
    jornadaNumero: fila.partido.jornada.numero,
    esNuestro: fila.equipo_id === nuestroEquipoId,
    jugador: fila.jugador ? mapearJugador(fila.jugador) : null,
    minuto: fila.minuto,
    marcador: { local: fila.marcador_local, visitante: fila.marcador_visitante },
  };
}
