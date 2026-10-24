import type { Equipo } from '@data-access/equipos/interfaces/equipo.interface';
import type { EstadoPartido } from './estado-partido.type';
import type { Marcador } from './marcador.interface';

/** Un partido del grupo, con los datos de su jornada que hacen falta para mostrarlo solo. */
export interface Partido {
  readonly id: string;
  readonly jornadaId: string;
  readonly jornadaNumero: number;
  /** Fecha del calendario oficial (`AAAA-MM-DD`), por si aún no hay hora fijada. */
  readonly fechaPrevista: string;
  readonly local: Equipo;
  readonly visitante: Equipo;
  readonly fechaHora: Date | null;
  readonly campo: string | null;
  readonly estado: EstadoPartido;
  /** `null` mientras no esté jugado. */
  readonly marcador: Marcador | null;
  readonly convocatoriaPublicada: boolean;
  /** `true` si juega nuestro equipo. */
  readonly esNuestro: boolean;
}
