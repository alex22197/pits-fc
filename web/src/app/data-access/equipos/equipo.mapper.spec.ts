import { describe, expect, it } from 'vitest';
import { mapearEquipo } from './equipo.mapper';
import { filaEquipo } from './equipo.fixtures';

describe('mapearEquipo', () => {
  it('traduce la fila al dominio', () => {
    expect(mapearEquipo(filaEquipo({ nombre: 'PITS FC', es_nuestro: true }))).toEqual({
      id: 'equipo-pits',
      nombre: 'PITS FC',
      nombreFederacion: 'PITS',
      esNuestro: true,
    });
  });
});
