import { describe, expect, it } from 'vitest';
import {
  formatearDia,
  formatearFechaHora,
  formatearFechaHoraLarga,
  formatearFechaPrevista,
  formatearHora,
} from './formatear-fecha';

const VIERNES_21H = new Date('2026-10-16T19:00:00Z'); // 21:00 en Madrid (verano)
const LUNES_INVIERNO = new Date('2026-11-09T21:00:00Z'); // 22:00 en Madrid (invierno)

describe('formatearFechaHora', () => {
  it('da día, mes y hora de Madrid en corto', () => {
    expect(formatearFechaHora(VIERNES_21H)).toBe('vie 16 oct · 21:00');
    expect(formatearFechaHora(LUNES_INVIERNO)).toBe('lun 9 nov · 22:00');
  });
});

describe('formatearFechaHoraLarga', () => {
  it('escribe el día completo', () => {
    expect(formatearFechaHoraLarga(VIERNES_21H)).toBe('viernes, 16 de octubre, 21:00');
  });
});

describe('formatearDia y formatearHora', () => {
  it('separan fecha y hora', () => {
    expect(formatearDia(VIERNES_21H)).toBe('vie 16 oct');
    expect(formatearHora(VIERNES_21H)).toBe('21:00');
  });
});

describe('formatearFechaPrevista', () => {
  it('no cambia de día por la zona horaria', () => {
    expect(formatearFechaPrevista('2026-10-23')).toBe('vie 23 oct');
    expect(formatearFechaPrevista('2027-01-08')).toBe('vie 8 ene');
  });
});
