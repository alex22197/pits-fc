import type { EstadisticasJugador } from './interfaces/estadisticas-jugador.interface';
import type { FilaEstadisticasJugador } from './interfaces/fila-estadisticas-jugador.type';

/**
 * Fila de la vista `estadisticas_jugador` → dominio. La vista no declara columnas
 * obligatorias, así que se rellenan los huecos; una fila sin id se descarta antes de llegar aquí.
 */
export function mapearEstadisticasJugador(
  fila: FilaEstadisticasJugador & { jugador_id: string },
): EstadisticasJugador {
  return {
    jugador: {
      id: fila.jugador_id,
      nombreMostrar: fila.nombre_mostrar ?? '',
      dorsal: fila.dorsal,
      posicion: fila.posicion,
      activo: fila.activo ?? true,
    },
    partidos: fila.partidos ?? 0,
    titularidades: fila.titularidades ?? 0,
    goles: fila.goles ?? 0,
    amarillas: fila.amarillas ?? 0,
    rojas: fila.rojas ?? 0,
    golesEncajados: fila.goles_encajados ?? 0,
  };
}

/** Solo las filas con jugador; las demás son un hueco de la vista, no un jugador. */
export function tieneJugador(
  fila: FilaEstadisticasJugador,
): fila is FilaEstadisticasJugador & { jugador_id: string } {
  return fila.jugador_id !== null;
}
