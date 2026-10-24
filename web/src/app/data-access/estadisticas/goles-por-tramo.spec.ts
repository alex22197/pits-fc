import { describe, expect, it } from 'vitest';
import { golEquipo, RIVAL_ID } from './gol-equipo.fixtures';
import { golesPorTramo, TRAMO_SIN_MINUTO } from './goles-por-tramo';

describe('golesPorTramo', () => {
  it('reparte los goles en tramos de diez minutos y el descuento en «50+»', () => {
    const tramos = golesPorTramo([
      golEquipo({ minuto: 0 }),
      golEquipo({ minuto: 9 }),
      golEquipo({ minuto: 10, equipo_id: RIVAL_ID, jugador: null }),
      golEquipo({ minuto: 47 }),
      golEquipo({ minuto: 52, equipo_id: RIVAL_ID, jugador: null }),
    ]);
    expect(tramos.map((t) => t.tramo)).toEqual(['0-10', '10-20', '20-30', '30-40', '40-50', '50+']);
    expect(tramos[0]).toEqual({ tramo: '0-10', favor: 2, contra: 0 });
    expect(tramos[1]).toEqual({ tramo: '10-20', favor: 0, contra: 1 });
    expect(tramos[4]).toEqual({ tramo: '40-50', favor: 1, contra: 0 });
    expect(tramos[5]).toEqual({ tramo: '50+', favor: 0, contra: 1 });
  });

  it('añade un tramo aparte solo si hay goles sin minuto', () => {
    expect(
      golesPorTramo([golEquipo({ minuto: 5 })]).some((t) => t.tramo === TRAMO_SIN_MINUTO),
    ).toBe(false);
    const conHueco = golesPorTramo([golEquipo({ minuto: null })]);
    expect(conHueco.at(-1)).toEqual({ tramo: TRAMO_SIN_MINUTO, favor: 1, contra: 0 });
  });
});
