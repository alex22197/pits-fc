import { describe, expect, it } from 'vitest';
import type { Partido } from './interfaces/partido.interface';
import { EQUIPO_OTRO, EQUIPO_RIVAL, filaPartido } from './partido.fixtures';
import { mapearPartido } from './partido.mapper';
import { elegirProximoPartido, partidosDeNuestroEquipo } from './proximo-partido';

function partido(cambios: Parameters<typeof filaPartido>[0], jornada = 3): Partido {
  return mapearPartido(
    filaPartido({ estado: 'programado', goles_local: null, goles_visitante: null, ...cambios }),
    { numero: jornada, fecha_prevista: '2026-10-23' },
  );
}

const AHORA = new Date('2026-10-20T12:00:00+00:00');

describe('elegirProximoPartido', () => {
  it('elige el pendiente más cercano en el futuro', () => {
    const proximo = elegirProximoPartido(
      [
        partido({ id: 'lejano', fecha_hora: '2026-11-06T20:00:00+00:00' }),
        partido({ id: 'cercano', fecha_hora: '2026-10-23T20:00:00+00:00' }),
        partido({
          id: 'jugado',
          estado: 'jugado',
          goles_local: 1,
          goles_visitante: 0,
          fecha_hora: '2026-10-16T20:00:00+00:00',
        }),
      ],
      AHORA,
    );
    expect(proximo?.id).toBe('cercano');
  });

  it('sigue eligiendo un partido que empezó hace menos de dos horas', () => {
    const proximo = elegirProximoPartido(
      [partido({ id: 'en-juego', fecha_hora: '2026-10-20T11:00:00+00:00' })],
      AHORA,
    );
    expect(proximo?.id).toBe('en-juego');
  });

  it('descarta un partido pendiente cuya fecha pasó hace más de dos horas', () => {
    const proximo = elegirProximoPartido(
      [partido({ id: 'pasado', fecha_hora: '2026-10-20T08:00:00+00:00' })],
      AHORA,
    );
    expect(proximo).toBeNull();
  });

  it('usa el final del día previsto cuando no hay hora', () => {
    const proximo = elegirProximoPartido([partido({ id: 'sin-hora', fecha_hora: null })], AHORA);
    expect(proximo?.id).toBe('sin-hora');
  });

  it('devuelve null si no queda nada pendiente', () => {
    expect(elegirProximoPartido([], AHORA)).toBeNull();
  });
});

describe('partidosDeNuestroEquipo', () => {
  it('aplana las jornadas y se queda con los nuestros', () => {
    const nuestros = partidosDeNuestroEquipo([
      {
        partidos: [
          partido({ id: 'nuestro' }),
          partido({ id: 'ajeno', local: EQUIPO_RIVAL, visitante: EQUIPO_OTRO }),
        ],
      },
      { partidos: [partido({ id: 'nuestro-2' }, 4)] },
    ]);
    expect(nuestros.map((p) => p.id)).toEqual(['nuestro', 'nuestro-2']);
  });
});
