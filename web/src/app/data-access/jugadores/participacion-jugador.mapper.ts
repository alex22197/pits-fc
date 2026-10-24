import { mapearPartido } from '@data-access/partidos/partido.mapper';
import type { FilaParticipacionJugador } from './interfaces/fila-participacion-jugador.type';
import type { ParticipacionJugador } from './interfaces/participacion-jugador.interface';

/** Fila de `participacion` (con partido) → `ParticipacionJugador` de dominio. */
export function mapearParticipacionJugador(fila: FilaParticipacionJugador): ParticipacionJugador {
  return {
    partido: mapearPartido(fila.partido, fila.partido.jornada),
    titular: fila.titular,
    dorsal: fila.dorsal,
  };
}
