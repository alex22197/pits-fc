import { describe, expect, it } from 'vitest';
import { mapearJornada } from './jornada.mapper';
import { EQUIPO_OTRO, EQUIPO_RIVAL, filaJornada, filaPartido } from './partido.fixtures';

describe('mapearJornada', () => {
  it('ordena los partidos por hora y deja sin hora al final', () => {
    const jornada = mapearJornada(
      filaJornada({}, [
        filaPartido({
          id: 'sin-hora',
          fecha_hora: null,
          local: EQUIPO_RIVAL,
          visitante: EQUIPO_OTRO,
        }),
        filaPartido({ id: 'tarde', fecha_hora: '2026-10-16T20:00:00+00:00' }),
        filaPartido({ id: 'pronto', fecha_hora: '2026-10-16T18:00:00+00:00' }),
      ]),
    );
    expect(jornada.partidos.map((partido) => partido.id)).toEqual(['pronto', 'tarde', 'sin-hora']);
  });

  it('copia a cada partido el número y la fecha de la jornada', () => {
    const jornada = mapearJornada(
      filaJornada({ numero: 5, fecha_prevista: '2026-11-13' }, [filaPartido()]),
    );
    expect(jornada.numero).toBe(5);
    expect(jornada.vuelta).toBe(1);
    expect(jornada.partidos[0]?.jornadaNumero).toBe(5);
    expect(jornada.partidos[0]?.fechaPrevista).toBe('2026-11-13');
  });

  it('traduce el equipo que descansa', () => {
    const jornada = mapearJornada({ ...filaJornada({ vuelta: 2 }), descansa: EQUIPO_OTRO });
    expect(jornada.vuelta).toBe(2);
    expect(jornada.descansa?.nombre).toBe('C.D. Montejo');
  });
});
