import { describe, expect, it } from 'vitest';
import { EQUIPO_PITS, EQUIPO_RIVAL, filaPartido } from '@data-access/partidos/partido.fixtures';
import { mapearPartido } from '@data-access/partidos/partido.mapper';
import { golesPorJornada, puntosPorJornada } from './puntos-por-jornada';

const PARTIDOS = [
  mapearPartido(filaPartido({ id: 'j4', goles_local: 1, goles_visitante: 2 }), {
    numero: 4,
    fecha_prevista: '2026-11-06',
  }),
  mapearPartido(filaPartido({ id: 'j2', goles_local: 3, goles_visitante: 3 }), {
    numero: 2,
    fecha_prevista: '2026-10-16',
  }),
  mapearPartido(
    filaPartido({
      id: 'j3',
      local: EQUIPO_RIVAL,
      visitante: EQUIPO_PITS,
      goles_local: 0,
      goles_visitante: 2,
    }),
    { numero: 3, fecha_prevista: '2026-10-23' },
  ),
  mapearPartido(
    filaPartido({ id: 'j5', estado: 'programado', goles_local: null, goles_visitante: null }),
    {
      numero: 5,
      fecha_prevista: '2026-11-13',
    },
  ),
];

describe('puntosPorJornada', () => {
  it('acumula 3, 1 y 0 puntos en orden de jornada con rival y marcador', () => {
    expect(puntosPorJornada(PARTIDOS)).toEqual([
      { jornada: 2, puntos: 1, resultado: 'empate', rival: 'Pride of Sparta', marcador: '3-3' },
      { jornada: 3, puntos: 4, resultado: 'victoria', rival: 'Pride of Sparta', marcador: '2-0' },
      { jornada: 4, puntos: 4, resultado: 'derrota', rival: 'Pride of Sparta', marcador: '1-2' },
    ]);
  });
});

describe('golesPorJornada', () => {
  it('da los goles desde nuestro lado, también cuando jugamos fuera', () => {
    expect(golesPorJornada(PARTIDOS)).toEqual([
      { jornada: 2, rival: 'Pride of Sparta', favor: 3, contra: 3 },
      { jornada: 3, rival: 'Pride of Sparta', favor: 2, contra: 0 },
      { jornada: 4, rival: 'Pride of Sparta', favor: 1, contra: 2 },
    ]);
  });
});
