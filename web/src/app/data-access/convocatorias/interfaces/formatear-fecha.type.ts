import type { Partido } from '@data-access/partidos/interfaces/partido.interface';

/** Cómo se escribe la fecha de un partido en un texto; lo decide quien llama (hora de Madrid). */
export type FormatearFecha = (partido: Partido) => string;
