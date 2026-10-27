import { describe, expect, it } from 'vitest';
import { calcularProximaImportacion } from './proxima-importacion';

describe('calcularProximaImportacion', () => {
  it('da el martes siguiente a las 8:00 UTC', () => {
    expect(calcularProximaImportacion(new Date('2026-10-29T17:00:00Z')).toISOString()).toBe(
      '2026-11-03T08:00:00.000Z',
    );
  });

  it('un martes antes de la hora, da ese mismo día', () => {
    expect(calcularProximaImportacion(new Date('2026-10-27T07:59:00Z')).toISOString()).toBe(
      '2026-10-27T08:00:00.000Z',
    );
  });

  it('un martes a la hora o después, da la semana siguiente', () => {
    expect(calcularProximaImportacion(new Date('2026-10-27T08:00:00Z')).toISOString()).toBe(
      '2026-11-03T08:00:00.000Z',
    );
    expect(calcularProximaImportacion(new Date('2026-10-27T22:30:00Z')).toISOString()).toBe(
      '2026-11-03T08:00:00.000Z',
    );
  });

  it('cruza el cambio de mes y de año', () => {
    expect(calcularProximaImportacion(new Date('2026-12-30T12:00:00Z')).toISOString()).toBe(
      '2027-01-05T08:00:00.000Z',
    );
  });
});
