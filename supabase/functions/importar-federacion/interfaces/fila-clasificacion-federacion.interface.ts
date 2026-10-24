/** Una fila de la clasificación tal como la publica la federación. */
export interface FilaClasificacionFederacion {
  readonly posicion: number;
  readonly codEquipo: string;
  readonly nombre: string;
  readonly puntos: number;
  readonly jugados: number;
  readonly ganados: number;
  readonly empatados: number;
  readonly perdidos: number;
  readonly golesFavor: number;
  readonly golesContra: number;
  /** Letras de los últimos resultados, p. ej. «G E P». */
  readonly ultimos: string;
  readonly sancion: number;
}
