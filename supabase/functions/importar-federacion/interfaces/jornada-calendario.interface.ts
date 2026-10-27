import type { PartidoCalendario } from './partido-calendario.interface.ts';

/** Una jornada tal como la lista la página de calendario de la intranet. */
export interface JornadaCalendario {
  readonly numero: number;
  /** `AAAA-MM-DD`. */
  readonly fecha: string;
  /** Nombre en la federación del equipo que descansa, si lo hay. */
  readonly descansa: string | null;
  readonly partidos: readonly PartidoCalendario[];
}
