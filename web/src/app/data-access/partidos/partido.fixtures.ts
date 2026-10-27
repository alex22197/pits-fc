import { filaEquipo } from '@data-access/equipos/equipo.fixtures';
import type { Tables } from '@core/supabase/interfaces/database.types';
import type { FilaJornada } from './interfaces/fila-jornada.type';
import type { FilaPartido } from './interfaces/fila-partido.type';

export const EQUIPO_PITS = filaEquipo();
export const EQUIPO_RIVAL = filaEquipo({
  id: 'equipo-sparta',
  nombre: 'Pride of Sparta',
  nombre_federacion: 'PRIDE OF SPARTA',
  cod_equipo: '303862',
  es_nuestro: false,
});
export const EQUIPO_OTRO = filaEquipo({
  id: 'equipo-montejo',
  nombre: 'C.D. Montejo',
  nombre_federacion: 'C.D. MONTEJO',
  cod_equipo: '305516',
  es_nuestro: false,
});

/** Fila de `partido` para tests: PITS contra Pride of Sparta, jugado 3-3. */
export function filaPartido(cambios: Partial<FilaPartido> = {}): FilaPartido {
  return {
    id: 'partido-1',
    jornada_id: 'jornada-2',
    local_id: EQUIPO_PITS.id,
    visitante_id: EQUIPO_RIVAL.id,
    fecha_hora: '2026-10-16T19:00:00+00:00',
    campo: 'Pvo. José Caballero, campo 2',
    estado: 'jugado',
    goles_local: 3,
    goles_visitante: 3,
    cod_acta: '93478',
    acta_importada_en: null,
    convocatoria_publicada: false,
    created_at: '2026-10-24T10:00:00+00:00',
    updated_at: '2026-10-24T10:00:00+00:00',
    local: EQUIPO_PITS,
    visitante: EQUIPO_RIVAL,
    ...cambios,
  };
}

/** Fila de `jornada` para tests, sin partidos salvo que se indiquen. */
export function filaJornada(
  cambios: Partial<Tables<'jornada'>> = {},
  partidos: readonly FilaPartido[] = [],
): FilaJornada {
  return {
    id: 'jornada-2',
    competicion_id: 'competicion-1',
    numero: 2,
    vuelta: 1,
    fecha_prevista: '2026-10-16',
    descansa_id: null,
    created_at: '2026-10-24T10:00:00+00:00',
    updated_at: '2026-10-24T10:00:00+00:00',
    ...cambios,
    descansa: null,
    partidos,
  };
}
