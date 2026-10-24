import { describe, expect, it } from 'vitest';
import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import { elegirFilas } from './tabla-clasificacion.component';

function fila(posicion: number, esNuestro = false): FilaClasificacion {
  return {
    equipo: {
      id: `equipo-${posicion}`,
      nombre: `Equipo ${posicion}`,
      nombreFederacion: '',
      esNuestro,
    },
    posicion,
    puntos: 0,
    jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    golesFavor: 0,
    golesContra: 0,
    diferencia: 0,
    sancion: 0,
    ultimos: [],
    actualizadoEn: new Date('2026-10-24T10:00:00Z'),
  };
}

const TABLA = [fila(1), fila(2), fila(3), fila(4), fila(5), fila(6), fila(7, true), fila(8)];

describe('elegirFilas', () => {
  it('devuelve toda la tabla si no se piden primeros', () => {
    expect(elegirFilas(TABLA, 0)).toHaveLength(8);
  });

  it('devuelve los primeros y añade nuestra fila si queda fuera', () => {
    expect(elegirFilas(TABLA, 3).map((f) => f.posicion)).toEqual([1, 2, 3, 7]);
  });

  it('no repite nuestra fila si ya está entre los primeros', () => {
    expect(elegirFilas(TABLA, 7).map((f) => f.posicion)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
