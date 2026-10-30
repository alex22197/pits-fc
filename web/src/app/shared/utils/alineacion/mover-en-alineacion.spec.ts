import { describe, expect, it } from 'vitest';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import { colocarEnAlineacion, puestoDe, sacarDeAlineacion } from './mover-en-alineacion';

const jugador = (id: string): Jugador => ({
  id,
  nombreMostrar: id,
  dorsal: null,
  posicion: null,
  activo: true,
});

const ana = jugador('ana');
const bea = jugador('bea');
const cris = jugador('cris');
const inicial = new Map([
  ['portero', ana],
  ['medio', bea],
] as const);

describe('colocarEnAlineacion', () => {
  it('pone en un hueco libre a quien venía de fuera', () => {
    const nueva = colocarEnAlineacion(inicial, cris, 'delantero');
    expect(nueva.get('delantero')).toBe(cris);
    expect(nueva.size).toBe(3);
    expect(inicial.size).toBe(2);
  });

  it('quien venía de fuera saca del campo al que ocupaba el puesto', () => {
    const nueva = colocarEnAlineacion(inicial, cris, 'portero');
    expect(nueva.get('portero')).toBe(cris);
    expect(puestoDe(nueva, 'ana')).toBeNull();
  });

  it('entre dos del campo, se intercambian los puestos', () => {
    const nueva = colocarEnAlineacion(inicial, ana, 'medio');
    expect(nueva.get('medio')).toBe(ana);
    expect(nueva.get('portero')).toBe(bea);
  });

  it('a un hueco libre desde otro puesto, deja el suyo vacío', () => {
    const nueva = colocarEnAlineacion(inicial, ana, 'delantero');
    expect(nueva.get('delantero')).toBe(ana);
    expect(nueva.has('portero')).toBe(false);
  });
});

describe('sacarDeAlineacion', () => {
  it('deja libre su puesto y no toca a nadie más', () => {
    const nueva = sacarDeAlineacion(inicial, 'bea');
    expect([...nueva.keys()]).toEqual(['portero']);
    expect(sacarDeAlineacion(inicial, 'nadie')).toBe(inicial);
  });
});
