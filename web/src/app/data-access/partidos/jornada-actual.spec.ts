import { describe, expect, it } from 'vitest';
import { elegirJornadaActual } from './jornada-actual';
import { mapearJornada } from './jornada.mapper';
import { filaJornada, filaPartido } from './partido.fixtures';

const jornada = (numero: number, fecha: string, jugado: boolean) =>
  mapearJornada(
    filaJornada({ id: `j${numero}`, numero, fecha_prevista: fecha }, [
      filaPartido({
        id: `p${numero}`,
        estado: jugado ? 'jugado' : 'programado',
        goles_local: jugado ? 1 : null,
        goles_visitante: jugado ? 0 : null,
      }),
    ]),
  );

const JORNADAS = [
  jornada(1, '2026-10-02', true),
  jornada(2, '2026-10-16', true),
  jornada(3, '2026-10-23', false),
  jornada(4, '2026-11-06', false),
];

describe('elegirJornadaActual', () => {
  it('elige la primera jornada pendiente que no haya pasado', () => {
    expect(elegirJornadaActual(JORNADAS, '2026-10-20')?.numero).toBe(3);
  });

  it('sigue en la jornada el día después de su fecha prevista', () => {
    expect(elegirJornadaActual(JORNADAS, '2026-10-24')?.numero).toBe(3);
  });

  it('pasa a la siguiente dos días después', () => {
    expect(elegirJornadaActual(JORNADAS, '2026-10-25')?.numero).toBe(4);
  });

  it('se queda en la última cuando no queda nada por jugar', () => {
    expect(elegirJornadaActual(JORNADAS, '2027-06-01')?.numero).toBe(4);
    expect(elegirJornadaActual([], '2027-06-01')).toBeNull();
  });
});
