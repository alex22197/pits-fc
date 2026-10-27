import { describe, expect, it } from 'vitest';
import type { DecisionConvocatoria } from '@data-access/convocatorias/interfaces/decision-convocatoria.interface';
import { anotarNota, colocarEnPuesto, decidirEstado, vaciarPuesto } from './decisiones-alineacion';

const decision = (
  jugadorId: string,
  cambios: Partial<DecisionConvocatoria> = {},
): DecisionConvocatoria => ({
  jugadorId,
  estado: 'convocado',
  puesto: null,
  nota: null,
  ...cambios,
});

const inicial = new Map([
  ['ana', decision('ana', { puesto: 'portero', nota: 'Trae los petos' })],
  ['bea', decision('bea')],
]);

describe('decidirEstado', () => {
  it('conserva el puesto mientras siga convocado y lo pierde si no', () => {
    expect(decidirEstado(inicial, 'ana', 'convocado').get('ana')?.puesto).toBe('portero');
    expect(decidirEstado(inicial, 'ana', 'duda').get('ana')).toEqual(
      decision('ana', { estado: 'duda', nota: 'Trae los petos' }),
    );
  });

  it('con null quita al jugador y no toca al resto', () => {
    const resultado = decidirEstado(inicial, 'ana', null);
    expect(resultado.has('ana')).toBe(false);
    expect(resultado.get('bea')).toEqual(decision('bea'));
    expect(inicial.size).toBe(2);
  });
});

describe('colocarEnPuesto y vaciarPuesto', () => {
  it('mueve al banquillo a quien ocupaba el puesto', () => {
    const resultado = colocarEnPuesto(inicial, 'bea', 'portero');
    expect(resultado.get('bea')?.puesto).toBe('portero');
    expect(resultado.get('ana')).toEqual(decision('ana', { nota: 'Trae los petos' }));
  });

  it('convoca a quien no estaba decidido', () => {
    expect(colocarEnPuesto(inicial, 'cris', 'medio').get('cris')).toEqual(
      decision('cris', { puesto: 'medio' }),
    );
  });

  it('vaciar deja al titular en el banquillo', () => {
    expect(vaciarPuesto(inicial, 'portero').get('ana')?.puesto).toBeNull();
    expect(vaciarPuesto(inicial, 'medio')).toEqual(inicial);
  });
});

describe('anotarNota', () => {
  it('guarda la nota recortada y vacía como null', () => {
    expect(anotarNota(inicial, 'bea', '  Llega tarde ').get('bea')?.nota).toBe('Llega tarde');
    expect(anotarNota(inicial, 'ana', '   ').get('ana')?.nota).toBeNull();
    expect(anotarNota(inicial, 'nadie', 'x')).toBe(inicial);
  });
});
