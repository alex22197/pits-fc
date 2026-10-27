import { describe, expect, it } from 'vitest';
import { filaJugador } from '@data-access/jugadores/jugador.fixtures';
import { filaPartido } from '@data-access/partidos/partido.fixtures';
import { mapearPartido } from '@data-access/partidos/partido.mapper';
import { mapearConvocado } from './convocado.mapper';
import type { FilaConvocado } from './interfaces/fila-convocado.type';
import { textoConvocatoria } from './texto-convocatoria';

function convocado(
  nombre: string,
  dorsal: number | null,
  estado: FilaConvocado['estado'],
  nota: string | null = null,
) {
  return mapearConvocado({
    partido_id: 'partido-1',
    jugador_id: nombre,
    estado,
    nota,
    created_at: '',
    updated_at: '',
    jugador: filaJugador({ id: nombre, nombre_mostrar: nombre, dorsal }),
  });
}

const PARTIDO = mapearPartido(
  filaPartido({ estado: 'programado', goles_local: null, goles_visitante: null }),
  {
    numero: 4,
    fecha_prevista: '2026-11-06',
  },
);

describe('textoConvocatoria', () => {
  it('escribe cabecera, convocados por dorsal y los demás grupos', () => {
    const texto = textoConvocatoria(
      PARTIDO,
      [
        convocado('Carlos', 10, 'convocado'),
        convocado('Raúl', 8, 'convocado'),
        convocado('Samuel', null, 'duda', 'Llega tarde'),
        convocado('Jorge', 14, 'descartado'),
      ],
      () => 'viernes, 6 de noviembre, 22:00',
    );
    expect(texto).toBe(
      [
        '*Convocatoria · Jornada 4*',
        'PITS FC - Pride of Sparta',
        'viernes, 6 de noviembre, 22:00',
        'Pvo. José Caballero, campo 2',
        '',
        '*Convocados*',
        '10. Carlos',
        '8. Raúl',
        '',
        '*Dudas*',
        'Samuel (Llega tarde)',
        '',
        '*No van*',
        '14. Jorge',
      ].join('\n'),
    );
  });

  it('omite los grupos vacíos', () => {
    const texto = textoConvocatoria(PARTIDO, [convocado('Carlos', 10, 'convocado')], () => 'fecha');
    expect(texto).not.toContain('Dudas');
    expect(texto).not.toContain('No van');
  });
});
