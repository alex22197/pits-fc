import { mapearEquipo } from '@data-access/equipos/equipo.mapper';
import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';
import type { FilaClasificacion } from './interfaces/fila-clasificacion.interface';
import type { FilaClasificacionBd } from './interfaces/fila-clasificacion-bd.type';

const LETRAS: Readonly<Record<string, ResultadoPartido>> = {
  G: 'victoria',
  E: 'empate',
  P: 'derrota',
};

/** Fila de `clasificacion` (con equipo) → `FilaClasificacion` de dominio. */
export function mapearFilaClasificacion(fila: FilaClasificacionBd): FilaClasificacion {
  return {
    equipo: mapearEquipo(fila.equipo),
    posicion: fila.posicion,
    puntos: fila.puntos,
    jugados: fila.jugados,
    ganados: fila.ganados,
    empatados: fila.empatados,
    perdidos: fila.perdidos,
    golesFavor: fila.goles_favor,
    golesContra: fila.goles_contra,
    diferencia: fila.goles_favor - fila.goles_contra,
    sancion: fila.sancion,
    ultimos: mapearUltimos(fila.ultimos),
    actualizadoEn: new Date(fila.actualizado_en),
  };
}

/** «G E P» de la federación → resultados; ignora cualquier letra desconocida. */
export function mapearUltimos(texto: string): ResultadoPartido[] {
  return texto
    .toUpperCase()
    .split(/\s+/)
    .map((letra) => LETRAS[letra])
    .filter((resultado): resultado is ResultadoPartido => resultado !== undefined);
}
