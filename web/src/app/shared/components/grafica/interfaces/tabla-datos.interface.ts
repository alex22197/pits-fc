/** Los mismos datos de una gráfica, en tabla: para leerlos sin pasar el ratón ni ver colores. */
export interface TablaDatos {
  readonly cabeceras: readonly string[];
  readonly filas: readonly (readonly (string | number)[])[];
}
