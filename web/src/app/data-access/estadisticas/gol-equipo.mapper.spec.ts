import { describe, expect, it } from 'vitest';
import { filaGolEquipo, NUESTRO_ID, RIVAL_ID } from './gol-equipo.fixtures';
import { mapearGolEquipo } from './gol-equipo.mapper';

describe('mapearGolEquipo', () => {
  it('traduce un gol nuestro con su autor y su jornada', () => {
    const gol = mapearGolEquipo(filaGolEquipo(), NUESTRO_ID);
    expect(gol.esNuestro).toBe(true);
    expect(gol.jugador?.nombreMostrar).toBe('Carlos');
    expect(gol.jornadaNumero).toBe(2);
    expect(gol.marcador).toEqual({ local: 1, visitante: 0 });
  });

  it('marca como del rival un gol de otro equipo, sin autor', () => {
    const gol = mapearGolEquipo(filaGolEquipo({ equipo_id: RIVAL_ID, jugador: null }), NUESTRO_ID);
    expect(gol.esNuestro).toBe(false);
    expect(gol.jugador).toBeNull();
  });
});
