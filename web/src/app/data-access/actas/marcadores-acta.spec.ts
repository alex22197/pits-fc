import { describe, expect, it } from 'vitest';
import type { GolActa } from './interfaces/gol-acta.interface';
import { contarGoles, marcadoresDeLosGoles, ordenarGoles } from './marcadores-acta';

const gol = (
  nuestro: boolean,
  minuto: number | null,
  jugadorId: string | null = null,
): GolActa => ({
  nuestro,
  minuto,
  jugadorId,
  asistenteId: null,
});

describe('marcadoresDeLosGoles', () => {
  it('va sumando el marcador en orden de minuto, según quién sea local', () => {
    const goles = [gol(false, 60), gol(true, 12, 'carlos'), gol(true, 75)];
    expect(marcadoresDeLosGoles(goles, true).map((g) => g.marcador)).toEqual([
      { local: 1, visitante: 0 },
      { local: 1, visitante: 1 },
      { local: 2, visitante: 1 },
    ]);
    expect(marcadoresDeLosGoles(goles, false).map((g) => g.marcador)).toEqual([
      { local: 0, visitante: 1 },
      { local: 1, visitante: 1 },
      { local: 1, visitante: 2 },
    ]);
  });
});

describe('ordenarGoles', () => {
  it('deja los goles sin minuto al final y en su orden', () => {
    const goles = [gol(true, null, 'a'), gol(false, 30), gol(true, null, 'b'), gol(true, 5)];
    expect(ordenarGoles(goles).map((g) => g.minuto ?? g.jugadorId)).toEqual([5, 30, 'a', 'b']);
  });
});

describe('contarGoles', () => {
  it('separa los nuestros de los del rival', () => {
    expect(contarGoles([gol(true, 1), gol(false, 2), gol(true, 3)])).toEqual({
      nuestros: 2,
      rival: 1,
    });
  });
});
