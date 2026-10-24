/** Un partido de la página de jornada: lo que el calendario no trae (fecha, hora y campo). */
export interface PartidoJornada {
  readonly codActa: string | null;
  readonly local: string;
  readonly visitante: string;
  /** `AAAA-MM-DD`, si la federación ya ha fijado el día. */
  readonly fecha: string | null;
  /** `HH:MM`. */
  readonly hora: string | null;
  readonly campo: string | null;
  readonly golesLocal: number | null;
  readonly golesVisitante: number | null;
}
