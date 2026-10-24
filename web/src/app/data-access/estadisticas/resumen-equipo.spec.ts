import { describe, expect, it } from 'vitest';
import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import {
  EQUIPO_OTRO,
  EQUIPO_PITS,
  EQUIPO_RIVAL,
  filaPartido,
} from '@data-access/partidos/partido.fixtures';
import { mapearPartido } from '@data-access/partidos/partido.mapper';
import { calcularResumenEquipo } from './resumen-equipo';

function jugado(
  jornada: number,
  golesLocal: number,
  golesVisitante: number,
  enCasa = true,
): Partido {
  return mapearPartido(
    filaPartido({
      id: `partido-${jornada}`,
      local: enCasa ? EQUIPO_PITS : EQUIPO_RIVAL,
      visitante: enCasa ? EQUIPO_RIVAL : EQUIPO_PITS,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      fecha_hora: `2026-10-${String(jornada).padStart(2, '0')}T20:00:00+00:00`,
    }),
    { numero: jornada, fecha_prevista: '2026-10-16' },
  );
}

const PENDIENTE = mapearPartido(
  filaPartido({ id: 'pendiente', estado: 'programado', goles_local: null, goles_visitante: null }),
  { numero: 9, fecha_prevista: '2026-12-18' },
);
const AJENO = mapearPartido(
  filaPartido({
    id: 'ajeno',
    local: EQUIPO_RIVAL,
    visitante: EQUIPO_OTRO,
    goles_local: 4,
    goles_visitante: 0,
  }),
  { numero: 1, fecha_prevista: '2026-10-02' },
);

describe('calcularResumenEquipo', () => {
  const resumen = calcularResumenEquipo([
    jugado(6, 0, 2, false), // fuera: el rival 0, nosotros 2 → victoria
    jugado(2, 3, 3), // casa: empate
    jugado(4, 1, 2), // casa: derrota
    jugado(5, 4, 1), // casa: victoria
    PENDIENTE,
    AJENO,
  ]);

  it('cuenta solo nuestros partidos jugados', () => {
    expect(resumen.jugados).toBe(4);
    expect(resumen.victorias).toBe(2);
    expect(resumen.empates).toBe(1);
    expect(resumen.derrotas).toBe(1);
  });

  it('suma goles desde nuestro lado y calcula diferencia y puntos', () => {
    expect(resumen.golesFavor).toBe(3 + 1 + 4 + 2);
    expect(resumen.golesContra).toBe(3 + 2 + 1 + 0);
    expect(resumen.diferencia).toBe(4);
    expect(resumen.puntos).toBe(7);
  });

  it('separa casa y fuera', () => {
    expect(resumen.casa).toEqual({
      jugados: 3,
      victorias: 1,
      empates: 1,
      derrotas: 1,
      golesFavor: 8,
      golesContra: 6,
    });
    expect(resumen.fuera).toEqual({
      jugados: 1,
      victorias: 1,
      empates: 0,
      derrotas: 0,
      golesFavor: 2,
      golesContra: 0,
    });
  });

  it('ordena los últimos resultados por jornada', () => {
    expect(resumen.ultimos).toEqual(['empate', 'derrota', 'victoria', 'victoria']);
  });

  it('devuelve ceros sin partidos', () => {
    const vacio = calcularResumenEquipo([PENDIENTE]);
    expect(vacio.jugados).toBe(0);
    expect(vacio.puntos).toBe(0);
    expect(vacio.ultimos).toEqual([]);
  });
});
