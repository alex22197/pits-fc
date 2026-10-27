/** Lo que ya hay en la base de datos y el scraper necesita para saber dónde guardar. */
export interface Contexto {
  readonly competicion: CompeticionBd;
  readonly nuestro: EquipoBd;
  readonly equipos: readonly EquipoBd[];
  readonly jornadas: readonly JornadaBd[];
  /** Se amplía si el calendario trae partidos que no existían. */
  readonly partidos: PartidoBd[];
}

export interface CompeticionBd {
  readonly id: string;
  readonly cod_competicion: string;
  readonly cod_grupo: string;
  readonly cod_temporada: string;
}

export interface EquipoBd {
  readonly id: string;
  readonly nombre_federacion: string;
  readonly cod_equipo: string | null;
  readonly es_nuestro: boolean;
}

export interface JornadaBd {
  readonly id: string;
  readonly numero: number;
  readonly fecha_prevista: string;
  readonly descansa_id: string | null;
}

export interface PartidoBd {
  readonly id: string;
  readonly jornada_id: string;
  readonly local_id: string;
  readonly visitante_id: string;
  estado: 'programado' | 'jugado' | 'aplazado' | 'suspendido';
  cod_acta: string | null;
  fecha_hora: string | null;
  acta_importada_en: string | null;
}
