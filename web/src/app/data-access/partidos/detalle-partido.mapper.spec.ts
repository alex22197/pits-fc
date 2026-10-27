import { describe, expect, it } from 'vitest';
import { filaJugador } from '@data-access/jugadores/jugador.fixtures';
import { mapearDetallePartido } from './detalle-partido.mapper';
import type { FilaDetallePartido } from './interfaces/fila-detalle-partido.type';
import { EQUIPO_PITS, EQUIPO_RIVAL, filaJornada, filaPartido } from './partido.fixtures';

const CARLOS = filaJugador({ id: 'carlos', nombre_mostrar: 'Carlos', dorsal: 10 });
const RAUL = filaJugador({ id: 'raul', nombre_mostrar: 'Raúl', dorsal: 8 });
const SAMUEL = filaJugador({ id: 'samuel', nombre_mostrar: 'Samuel', dorsal: 6 });

function filaDetalle(): FilaDetallePartido {
  const jornadaConPartidos = filaJornada();
  return {
    ...filaPartido(),
    jornada: {
      id: jornadaConPartidos.id,
      competicion_id: jornadaConPartidos.competicion_id,
      numero: jornadaConPartidos.numero,
      vuelta: jornadaConPartidos.vuelta,
      fecha_prevista: jornadaConPartidos.fecha_prevista,
      descansa_id: jornadaConPartidos.descansa_id,
      created_at: jornadaConPartidos.created_at,
      updated_at: jornadaConPartidos.updated_at,
    },
    participaciones: [
      {
        partido_id: 'partido-1',
        jugador_id: 'samuel',
        titular: false,
        dorsal: 6,
        created_at: '',
        jugador: SAMUEL,
      },
      {
        partido_id: 'partido-1',
        jugador_id: 'carlos',
        titular: true,
        dorsal: 10,
        created_at: '',
        jugador: CARLOS,
      },
      {
        partido_id: 'partido-1',
        jugador_id: 'raul',
        titular: true,
        dorsal: 8,
        created_at: '',
        jugador: RAUL,
      },
    ],
    goles: [
      {
        id: 'g3',
        partido_id: 'partido-1',
        equipo_id: EQUIPO_PITS.id,
        jugador_id: 'raul',
        asistente_id: null,
        minuto: 47,
        marcador_local: 3,
        marcador_visitante: 3,
        created_at: '',
        jugador: RAUL,
        asistente: null,
      },
      {
        id: 'g1',
        partido_id: 'partido-1',
        equipo_id: EQUIPO_PITS.id,
        jugador_id: 'carlos',
        asistente_id: null,
        minuto: 24,
        marcador_local: 1,
        marcador_visitante: 0,
        created_at: '',
        jugador: CARLOS,
        asistente: null,
      },
      {
        id: 'g2',
        partido_id: 'partido-1',
        equipo_id: EQUIPO_RIVAL.id,
        jugador_id: null,
        asistente_id: null,
        minuto: 28,
        marcador_local: 1,
        marcador_visitante: 1,
        created_at: '',
        jugador: null,
        asistente: null,
      },
    ],
    tarjetas: [
      {
        id: 't2',
        partido_id: 'partido-1',
        jugador_id: 'carlos',
        tipo: 'amarilla',
        minuto: 45,
        created_at: '',
        jugador: CARLOS,
      },
      {
        id: 't1',
        partido_id: 'partido-1',
        jugador_id: 'samuel',
        tipo: 'amarilla',
        minuto: 18,
        created_at: '',
        jugador: SAMUEL,
      },
    ],
  };
}

describe('mapearDetallePartido', () => {
  it('ordena titulares por dorsal y suplentes después', () => {
    const detalle = mapearDetallePartido(filaDetalle());
    expect(detalle.participantes.map((p) => p.jugador.nombreMostrar)).toEqual([
      'Raúl',
      'Carlos',
      'Samuel',
    ]);
  });

  it('ordena los goles por marcador y deja los rivales sin autor', () => {
    const detalle = mapearDetallePartido(filaDetalle());
    expect(detalle.goles.map((gol) => gol.id)).toEqual(['g1', 'g2', 'g3']);
    expect(detalle.goles[1]?.jugador).toBeNull();
    expect(detalle.goles[2]?.marcador).toEqual({ local: 3, visitante: 3 });
  });

  it('ordena las tarjetas por minuto', () => {
    const detalle = mapearDetallePartido(filaDetalle());
    expect(detalle.tarjetas.map((tarjeta) => tarjeta.minuto)).toEqual([18, 45]);
  });

  it('traduce el partido con los datos de su jornada', () => {
    const detalle = mapearDetallePartido(filaDetalle());
    expect(detalle.partido.jornadaNumero).toBe(2);
    expect(detalle.partido.marcador).toEqual({ local: 3, visitante: 3 });
  });
});
