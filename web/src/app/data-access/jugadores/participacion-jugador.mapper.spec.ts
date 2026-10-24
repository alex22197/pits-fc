import { describe, expect, it } from 'vitest';
import { filaJornada, filaPartido } from '@data-access/partidos/partido.fixtures';
import { mapearParticipacionJugador } from './participacion-jugador.mapper';

describe('mapearParticipacionJugador', () => {
  it('traduce la participación con su partido y la jornada', () => {
    const jornada = filaJornada({ numero: 2, fecha_prevista: '2026-10-16' });
    const participacion = mapearParticipacionJugador({
      partido_id: 'partido-1',
      jugador_id: 'jugador-1',
      titular: false,
      dorsal: 7,
      created_at: '',
      partido: {
        ...filaPartido(),
        jornada: {
          id: jornada.id,
          competicion_id: jornada.competicion_id,
          numero: jornada.numero,
          vuelta: jornada.vuelta,
          fecha_prevista: jornada.fecha_prevista,
          descansa_id: jornada.descansa_id,
          created_at: jornada.created_at,
          updated_at: jornada.updated_at,
        },
      },
    });
    expect(participacion.titular).toBe(false);
    expect(participacion.dorsal).toBe(7);
    expect(participacion.partido.jornadaNumero).toBe(2);
    expect(participacion.partido.marcador).toEqual({ local: 3, visitante: 3 });
  });
});
