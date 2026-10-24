import { describe, expect, it } from 'vitest';
import { filaPartido } from '@data-access/partidos/partido.fixtures';
import { mapearPartido } from '@data-access/partidos/partido.mapper';
import { FechaPartidoPipe } from './fecha-partido.pipe';

const JORNADA = { numero: 2, fecha_prevista: '2026-10-16' };

describe('FechaPartidoPipe', () => {
  const pipe = new FechaPartidoPipe();

  it('usa la fecha y hora reales cuando existen', () => {
    const partido = mapearPartido(
      filaPartido({ fecha_hora: '2026-10-16T19:00:00+00:00' }),
      JORNADA,
    );
    expect(pipe.transform(partido)).toBe('vie 16 oct · 21:00');
    expect(pipe.transform(partido, 'larga')).toBe('viernes, 16 de octubre, 21:00');
  });

  it('cae al día previsto si no hay hora', () => {
    const partido = mapearPartido(filaPartido({ fecha_hora: null }), JORNADA);
    expect(pipe.transform(partido)).toBe('vie 16 oct · hora por fijar');
  });
});
