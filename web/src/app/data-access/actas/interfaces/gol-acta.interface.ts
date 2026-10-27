/** Un gol tal como lo apunta un gestor: de quién fue y, si es nuestro, quién lo marcó y quién asistió. */
export interface GolActa {
  readonly nuestro: boolean;
  readonly minuto: number | null;
  /** Solo si el gol es nuestro; `null` si no se sabe quién lo marcó. */
  readonly jugadorId: string | null;
  readonly asistenteId: string | null;
}
