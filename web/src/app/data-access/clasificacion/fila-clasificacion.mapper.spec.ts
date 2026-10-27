import { describe, expect, it } from 'vitest';
import { filaEquipo } from '@data-access/equipos/equipo.fixtures';
import { mapearFilaClasificacion, mapearUltimos } from './fila-clasificacion.mapper';

describe('mapearFilaClasificacion', () => {
  it('traduce la fila, calcula la diferencia de goles y lee los últimos resultados', () => {
    const fila = mapearFilaClasificacion({
      competicion_id: 'competicion-1',
      equipo_id: 'equipo-pits',
      posicion: 7,
      puntos: 1,
      jugados: 1,
      ganados: 0,
      empatados: 1,
      perdidos: 0,
      goles_favor: 3,
      goles_contra: 5,
      sancion: 0,
      ultimos: 'E',
      actualizado_en: '2026-10-23T10:00:00+00:00',
      equipo: filaEquipo(),
    });
    expect(fila.equipo.nombre).toBe('PITS FC');
    expect(fila.posicion).toBe(7);
    expect(fila.diferencia).toBe(-2);
    expect(fila.ultimos).toEqual(['empate']);
    expect(fila.actualizadoEn).toEqual(new Date('2026-10-23T10:00:00+00:00'));
  });
});

describe('mapearUltimos', () => {
  it('traduce las letras de la federación', () => {
    expect(mapearUltimos('G E P')).toEqual(['victoria', 'empate', 'derrota']);
  });

  it('ignora lo que no conoce y los espacios de más', () => {
    expect(mapearUltimos('  g   x P ')).toEqual(['victoria', 'derrota']);
    expect(mapearUltimos('')).toEqual([]);
  });
});
