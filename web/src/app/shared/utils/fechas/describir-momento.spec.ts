import { describe, expect, it } from 'vitest';
import { describirMomento } from './describir-momento';

// Martes 27 de octubre de 2026 a las 13:00 en Madrid (ya en horario de invierno).
const AHORA = new Date('2026-10-27T12:00:00Z');

describe('describirMomento', () => {
  it('dice hoy, ayer o mañana cuando toca', () => {
    expect(describirMomento(new Date('2026-10-27T08:00:40Z'), AHORA)).toBe('hoy a las 09:00');
    expect(describirMomento(new Date('2026-10-26T20:15:00Z'), AHORA)).toBe('ayer a las 21:15');
    expect(describirMomento(new Date('2026-10-28T08:00:00Z'), AHORA)).toBe('mañana a las 09:00');
  });

  it('cuenta los días en Madrid, no en UTC', () => {
    // 23:30 UTC del 27 ya es miércoles 28 en Madrid.
    expect(describirMomento(new Date('2026-10-27T23:30:00Z'), AHORA)).toBe('mañana a las 00:30');
  });

  it('con más distancia, escribe el día completo', () => {
    expect(describirMomento(new Date('2026-11-03T08:00:00Z'), AHORA)).toBe(
      'el martes 3 de noviembre a las 09:00',
    );
    expect(describirMomento(new Date('2026-10-24T15:30:00Z'), AHORA)).toBe(
      'el sábado 24 de octubre a las 17:30',
    );
  });
});
