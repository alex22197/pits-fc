/** Una liga en una temporada, con su grupo. */
export interface Competicion {
  readonly id: string;
  readonly nombre: string;
  readonly temporada: string;
  readonly grupo: string;
  readonly activa: boolean;
}
