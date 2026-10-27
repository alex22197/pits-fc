/** Una ejecución del scraper de la federación, tal como queda registrada. */
export interface EjecucionImportacion {
  readonly id: string;
  readonly inicio: Date;
  readonly fin: Date | null;
  /** `null` mientras está en marcha. */
  readonly estado: 'ok' | 'error' | null;
  readonly llamante: string | null;
  readonly partidosActualizados: number;
  readonly filasClasificacion: number;
  readonly actasImportadas: number;
  readonly jugadoresNuevos: readonly string[];
  readonly avisos: readonly string[];
  readonly errores: readonly string[];
}
