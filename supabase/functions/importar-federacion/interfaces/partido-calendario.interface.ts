/** Un partido del calendario: equipos, código de acta y marcador si ya se jugó. */
export interface PartidoCalendario {
  readonly codActa: string;
  readonly local: string;
  readonly visitante: string;
  readonly golesLocal: number | null;
  readonly golesVisitante: number | null;
}
