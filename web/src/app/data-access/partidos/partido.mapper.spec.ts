import { describe, expect, it } from 'vitest';
import { mapearPartido } from './partido.mapper';
import { EQUIPO_OTRO, EQUIPO_RIVAL, filaPartido } from './partido.fixtures';

const JORNADA = { numero: 2, fecha_prevista: '2026-10-16' };

describe('mapearPartido', () => {
  it('traduce un partido jugado con su marcador y su jornada', () => {
    const partido = mapearPartido(filaPartido(), JORNADA);
    expect(partido.id).toBe('partido-1');
    expect(partido.jornadaNumero).toBe(2);
    expect(partido.fechaPrevista).toBe('2026-10-16');
    expect(partido.local.nombre).toBe('PITS FC');
    expect(partido.visitante.nombre).toBe('Pride of Sparta');
    expect(partido.fechaHora).toEqual(new Date('2026-10-16T19:00:00+00:00'));
    expect(partido.marcador).toEqual({ local: 3, visitante: 3 });
    expect(partido.esNuestro).toBe(true);
  });

  it('deja el marcador y la hora vacíos en un partido por jugar', () => {
    const partido = mapearPartido(
      filaPartido({
        estado: 'programado',
        goles_local: null,
        goles_visitante: null,
        fecha_hora: null,
      }),
      JORNADA,
    );
    expect(partido.marcador).toBeNull();
    expect(partido.fechaHora).toBeNull();
  });

  it('marca como ajeno un partido entre otros dos equipos', () => {
    const partido = mapearPartido(
      filaPartido({ local: EQUIPO_RIVAL, visitante: EQUIPO_OTRO }),
      JORNADA,
    );
    expect(partido.esNuestro).toBe(false);
  });
});
