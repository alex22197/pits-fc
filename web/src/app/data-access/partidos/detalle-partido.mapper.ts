import { mapearJugador } from '@data-access/jugadores/jugador.mapper';
import type { DetallePartido } from './interfaces/detalle-partido.interface';
import type { FilaDetallePartido } from './interfaces/fila-detalle-partido.type';
import type { Participante } from './interfaces/participante.interface';
import { mapearPartido } from './partido.mapper';

/** Fila de `partido` con jornada, equipos y acta → `DetallePartido` de dominio. */
export function mapearDetallePartido(fila: FilaDetallePartido): DetallePartido {
  return {
    partido: mapearPartido(fila, fila.jornada),
    participantes: fila.participaciones
      .map((participacion) => ({
        jugador: mapearJugador(participacion.jugador),
        titular: participacion.titular,
        dorsal: participacion.dorsal,
      }))
      .sort(compararParticipantes),
    goles: [...fila.goles]
      .sort(
        (a, b) =>
          a.marcador_local + a.marcador_visitante - (b.marcador_local + b.marcador_visitante),
      )
      .map((gol) => ({
        id: gol.id,
        equipoId: gol.equipo_id,
        jugador: gol.jugador ? mapearJugador(gol.jugador) : null,
        asistente: gol.asistente ? mapearJugador(gol.asistente) : null,
        minuto: gol.minuto,
        marcador: { local: gol.marcador_local, visitante: gol.marcador_visitante },
      })),
    tarjetas: [...fila.tarjetas]
      .sort((a, b) => (a.minuto ?? Infinity) - (b.minuto ?? Infinity))
      .map((tarjeta) => ({
        id: tarjeta.id,
        jugador: mapearJugador(tarjeta.jugador),
        tipo: tarjeta.tipo,
        minuto: tarjeta.minuto,
      })),
  };
}

/** Titulares antes que suplentes; dentro de cada grupo, por dorsal (sin dorsal, al final). */
function compararParticipantes(a: Participante, b: Participante): number {
  if (a.titular !== b.titular) {
    return a.titular ? -1 : 1;
  }
  return (a.dorsal ?? Infinity) - (b.dorsal ?? Infinity);
}
