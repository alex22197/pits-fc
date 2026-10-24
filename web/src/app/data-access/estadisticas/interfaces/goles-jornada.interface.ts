/** Goles a favor y en contra en una jornada jugada. */
export interface GolesJornada {
  readonly jornada: number;
  readonly rival: string;
  readonly favor: number;
  readonly contra: number;
}
