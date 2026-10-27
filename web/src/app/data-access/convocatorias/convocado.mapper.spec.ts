import { describe, expect, it } from 'vitest';
import { filaJugador } from '@data-access/jugadores/jugador.fixtures';
import { compararConvocados, mapearConvocado } from './convocado.mapper';
import type { FilaConvocado } from './interfaces/fila-convocado.type';

function fila(cambios: Partial<FilaConvocado> = {}): FilaConvocado {
  return {
    partido_id: 'partido-1',
    jugador_id: 'jugador-1',
    estado: 'convocado',
    puesto: null,
    nota: null,
    created_at: '',
    updated_at: '',
    jugador: filaJugador(),
    ...cambios,
  };
}

describe('mapearConvocado', () => {
  it('traduce la fila con su jugador', () => {
    expect(mapearConvocado(fila({ estado: 'duda', nota: 'Llega tarde' }))).toEqual({
      jugador: {
        id: 'jugador-1',
        nombreMostrar: 'Carlos',
        dorsal: 10,
        posicion: 'delantero',
        activo: true,
      },
      estado: 'duda',
      puesto: null,
      nota: 'Llega tarde',
    });
  });
});

describe('compararConvocados', () => {
  it('ordena titulares por puesto, luego banquillo por dorsal, dudas y descartados', () => {
    const lista = [
      mapearConvocado(
        fila({
          estado: 'convocado',
          puesto: 'medio',
          jugador: filaJugador({ id: 't-mc', dorsal: 8 }),
        }),
      ),
      mapearConvocado(
        fila({
          estado: 'convocado',
          puesto: 'portero',
          jugador: filaJugador({ id: 't-por', dorsal: 13 }),
        }),
      ),
      mapearConvocado(fila({ estado: 'descartado', jugador: filaJugador({ id: 'd', dorsal: 1 }) })),
      mapearConvocado(fila({ estado: 'convocado', jugador: filaJugador({ id: 'c9', dorsal: 9 }) })),
      mapearConvocado(fila({ estado: 'duda', jugador: filaJugador({ id: 'u', dorsal: 4 }) })),
      mapearConvocado(
        fila({ estado: 'convocado', jugador: filaJugador({ id: 'c-sin', dorsal: null }) }),
      ),
      mapearConvocado(fila({ estado: 'convocado', jugador: filaJugador({ id: 'c2', dorsal: 2 }) })),
    ].sort(compararConvocados);
    expect(lista.map((convocado) => convocado.jugador.id)).toEqual([
      't-por',
      't-mc',
      'c2',
      'c9',
      'c-sin',
      'u',
      'd',
    ]);
  });
});
