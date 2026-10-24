/** Lo que trae el acta de un partido. Los nombres son los completos de la federación. */
export interface Acta {
  readonly fecha: string | null;
  readonly hora: string | null;
  readonly golesLocal: number | null;
  readonly golesVisitante: number | null;
  readonly campo: string | null;
  readonly local: EquipoActa;
  readonly visitante: EquipoActa;
  /** En orden de marcador. */
  readonly goles: readonly GolActa[];
}

export interface EquipoActa {
  readonly nombre: string;
  readonly titulares: readonly JugadorActa[];
  readonly suplentes: readonly JugadorActa[];
  readonly tarjetas: readonly TarjetaActa[];
}

export interface JugadorActa {
  readonly dorsal: number | null;
  readonly nombre: string;
}

export interface TarjetaActa {
  readonly nombre: string;
  readonly tipo: 'amarilla' | 'roja';
  readonly minuto: number | null;
}

export interface GolActa {
  readonly marcadorLocal: number;
  readonly marcadorVisitante: number;
  readonly nombre: string;
  readonly minuto: number | null;
}
