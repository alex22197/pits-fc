import type { Equipo } from '@data-access/equipos/interfaces/equipo.interface';
import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';

/** Una fila de la clasificación del grupo, tal como la publica la federación. */
export interface FilaClasificacion {
  readonly equipo: Equipo;
  readonly posicion: number;
  readonly puntos: number;
  readonly jugados: number;
  readonly ganados: number;
  readonly empatados: number;
  readonly perdidos: number;
  readonly golesFavor: number;
  readonly golesContra: number;
  readonly diferencia: number;
  /** Puntos de sanción que la federación resta. */
  readonly sancion: number;
  /** Últimos resultados, del más antiguo al más reciente. */
  readonly ultimos: readonly ResultadoPartido[];
  readonly actualizadoEn: Date;
}
