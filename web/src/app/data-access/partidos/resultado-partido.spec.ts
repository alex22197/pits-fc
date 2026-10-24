import { describe, expect, it } from 'vitest';
import { EQUIPO_OTRO, EQUIPO_PITS, EQUIPO_RIVAL, filaPartido } from './partido.fixtures';
import { mapearPartido } from './partido.mapper';
import { elegirUltimoResultado, resultadoParaNosotros } from './resultado-partido';

const JORNADA = { numero: 2, fecha_prevista: '2026-10-16' };
const jugado = (cambios: Parameters<typeof filaPartido>[0]) =>
  mapearPartido(filaPartido({ estado: 'jugado', ...cambios }), JORNADA);

describe('resultadoParaNosotros', () => {
  it('victoria, empate y derrota jugando en casa', () => {
    expect(resultadoParaNosotros(jugado({ goles_local: 2, goles_visitante: 1 }))).toBe('victoria');
    expect(resultadoParaNosotros(jugado({ goles_local: 3, goles_visitante: 3 }))).toBe('empate');
    expect(resultadoParaNosotros(jugado({ goles_local: 0, goles_visitante: 4 }))).toBe('derrota');
  });

  it('mira nuestro lado cuando jugamos fuera', () => {
    const fuera = jugado({
      local: EQUIPO_RIVAL,
      visitante: EQUIPO_PITS,
      goles_local: 1,
      goles_visitante: 2,
    });
    expect(resultadoParaNosotros(fuera)).toBe('victoria');
  });

  it('null si el partido no está jugado o no es nuestro', () => {
    const pendiente = mapearPartido(
      filaPartido({ estado: 'programado', goles_local: null, goles_visitante: null }),
      JORNADA,
    );
    expect(resultadoParaNosotros(pendiente)).toBeNull();
    expect(
      resultadoParaNosotros(jugado({ local: EQUIPO_RIVAL, visitante: EQUIPO_OTRO })),
    ).toBeNull();
  });
});

describe('elegirUltimoResultado', () => {
  it('devuelve el jugado más reciente', () => {
    const ultimo = elegirUltimoResultado([
      jugado({ id: 'antiguo', fecha_hora: '2026-10-02T20:00:00+00:00' }),
      jugado({ id: 'reciente', fecha_hora: '2026-10-16T20:00:00+00:00' }),
      mapearPartido(
        filaPartido({
          id: 'pendiente',
          estado: 'programado',
          goles_local: null,
          goles_visitante: null,
        }),
        JORNADA,
      ),
    ]);
    expect(ultimo?.id).toBe('reciente');
  });

  it('null si no hay ninguno jugado', () => {
    expect(elegirUltimoResultado([])).toBeNull();
  });
});
