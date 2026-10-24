import { mapearEquipo } from '@data-access/equipos/equipo.mapper';
import type { DatosJornadaDePartido, FilaPartido } from './interfaces/fila-partido.type';
import type { Partido } from './interfaces/partido.interface';

/** Fila de `partido` (con equipos) y su jornada → `Partido` de dominio. */
export function mapearPartido(fila: FilaPartido, jornada: DatosJornadaDePartido): Partido {
  const local = mapearEquipo(fila.local);
  const visitante = mapearEquipo(fila.visitante);
  return {
    id: fila.id,
    jornadaId: fila.jornada_id,
    jornadaNumero: jornada.numero,
    fechaPrevista: jornada.fecha_prevista,
    local,
    visitante,
    fechaHora: fila.fecha_hora ? new Date(fila.fecha_hora) : null,
    campo: fila.campo,
    estado: fila.estado,
    marcador:
      fila.goles_local !== null && fila.goles_visitante !== null
        ? { local: fila.goles_local, visitante: fila.goles_visitante }
        : null,
    convocatoriaPublicada: fila.convocatoria_publicada,
    esNuestro: local.esNuestro || visitante.esNuestro,
  };
}
