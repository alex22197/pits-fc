import { describe, expect, it } from 'vitest';
import { mapearCompeticion } from './competicion.mapper';

describe('mapearCompeticion', () => {
  it('traduce la fila al dominio sin los códigos de la federación', () => {
    expect(
      mapearCompeticion({
        id: 'competicion-1',
        nombre: 'Ayto. Alcobendas Fútbol 7',
        temporada: '2026-2027',
        grupo: '2ª Aficionados G2',
        cod_competicion: '339610',
        cod_grupo: '339627',
        cod_temporada: '22',
        activa: true,
        created_at: '2026-10-24T10:00:00+00:00',
        updated_at: '2026-10-24T10:00:00+00:00',
      }),
    ).toEqual({
      id: 'competicion-1',
      nombre: 'Ayto. Alcobendas Fútbol 7',
      temporada: '2026-2027',
      grupo: '2ª Aficionados G2',
      activa: true,
    });
  });
});
