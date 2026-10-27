import { describe, expect, it } from 'vitest';
import { filaJugador } from './jugador.fixtures';
import { mapearJugador } from './jugador.mapper';

describe('mapearJugador', () => {
  it('traduce la fila al dominio', () => {
    expect(mapearJugador(filaJugador())).toEqual({
      id: 'jugador-1',
      nombreMostrar: 'Carlos',
      dorsal: 10,
      posicion: 'delantero',
      activo: true,
    });
  });

  it('conserva los huecos de dorsal y posición', () => {
    const jugador = mapearJugador(filaJugador({ dorsal: null, posicion: null }));
    expect(jugador.dorsal).toBeNull();
    expect(jugador.posicion).toBeNull();
  });
});
