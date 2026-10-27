import { describe, expect, it } from 'vitest';
import { mapearEstadisticasJugador, tieneJugador } from './estadisticas-jugador.mapper';
import type { FilaEstadisticasJugador } from './interfaces/fila-estadisticas-jugador.type';

const FILA: FilaEstadisticasJugador = {
  jugador_id: 'jugador-1',
  nombre_mostrar: 'Carlos',
  dorsal: 10,
  posicion: 'delantero',
  activo: true,
  partidos: 2,
  titularidades: 1,
  goles: 3,
  asistencias: 2,
  amarillas: 1,
  rojas: 0,
  goles_encajados: 4,
};

describe('mapearEstadisticasJugador', () => {
  it('traduce la fila de la vista', () => {
    expect(mapearEstadisticasJugador({ ...FILA, jugador_id: 'jugador-1' })).toEqual({
      jugador: {
        id: 'jugador-1',
        nombreMostrar: 'Carlos',
        dorsal: 10,
        posicion: 'delantero',
        activo: true,
      },
      partidos: 2,
      titularidades: 1,
      goles: 3,
      asistencias: 2,
      amarillas: 1,
      rojas: 0,
      golesEncajados: 4,
    });
  });

  it('rellena con cero los contadores que la vista deje vacíos', () => {
    const estadisticas = mapearEstadisticasJugador({
      ...FILA,
      jugador_id: 'jugador-1',
      partidos: null,
      goles: null,
      asistencias: null,
      goles_encajados: null,
    });
    expect(estadisticas.partidos).toBe(0);
    expect(estadisticas.goles).toBe(0);
    expect(estadisticas.golesEncajados).toBe(0);
  });
});

describe('tieneJugador', () => {
  it('descarta las filas sin id', () => {
    expect(tieneJugador(FILA)).toBe(true);
    expect(tieneJugador({ ...FILA, jugador_id: null })).toBe(false);
  });
});
