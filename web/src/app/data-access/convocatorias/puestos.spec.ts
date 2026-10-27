import { describe, expect, it } from 'vitest';
import { filaJugador } from '@data-access/jugadores/jugador.fixtures';
import { mapearConvocado } from './convocado.mapper';
import type { FilaConvocado } from './interfaces/fila-convocado.type';
import { PUESTOS, banquillo, nombreDelPuesto, ordenDelPuesto, titularesPorPuesto } from './puestos';

function convocado(id: string, cambios: Partial<FilaConvocado> = {}) {
  return mapearConvocado({
    partido_id: 'partido-1',
    jugador_id: id,
    estado: 'convocado',
    puesto: null,
    nota: null,
    created_at: '',
    updated_at: '',
    jugador: filaJugador({ id, nombre_mostrar: id }),
    ...cambios,
  });
}

describe('PUESTOS', () => {
  it('son los siete del 1-2-3-1, de la portería hacia delante', () => {
    expect(PUESTOS.map((p) => p.puesto)).toEqual([
      'portero',
      'central_izquierdo',
      'central_derecho',
      'lateral_izquierdo',
      'medio',
      'lateral_derecho',
      'delantero',
    ]);
    expect(nombreDelPuesto('lateral_izquierdo')).toBe('Lateral izquierdo');
    expect(ordenDelPuesto('portero')).toBe(0);
    expect(ordenDelPuesto(null)).toBe(7);
  });
});

describe('titularesPorPuesto y banquillo', () => {
  const lista = [
    convocado('Ana', { puesto: 'portero' }),
    convocado('Bea', { puesto: 'medio' }),
    convocado('Cris'),
    convocado('Dani', { estado: 'duda' }),
    convocado('Eva', { estado: 'descartado' }),
  ];

  it('reparten titulares y banquillo, y dejan fuera dudas y descartados', () => {
    const titulares = titularesPorPuesto(lista);
    expect([...titulares.keys()]).toEqual(['portero', 'medio']);
    expect(titulares.get('medio')?.nombreMostrar).toBe('Bea');
    expect(banquillo(lista).map((c) => c.jugador.nombreMostrar)).toEqual(['Cris']);
  });
});
