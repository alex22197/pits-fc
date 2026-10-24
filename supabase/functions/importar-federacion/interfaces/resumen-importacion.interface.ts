/** Lo que cuenta una ejecución del scraper; se guarda en `ejecucion_scraper.resumen`. */
export interface ResumenImportacion {
  llamante: string;
  partidosActualizados: number;
  jornadasConDetalle: number;
  filasClasificacion: number;
  actasImportadas: number;
  /** Nombres cortos creados para jugadores que no estaban dados de alta. */
  jugadoresNuevos: string[];
  /** Cosas raras que no impiden seguir: equipos desconocidos, partidos sin sitio… */
  avisos: string[];
  /** Pasos que han fallado; el resto de la importación sigue. */
  errores: string[];
}

export function resumenVacio(llamante: string): ResumenImportacion {
  return {
    llamante,
    partidosActualizados: 0,
    jornadasConDetalle: 0,
    filasClasificacion: 0,
    actasImportadas: 0,
    jugadoresNuevos: [],
    avisos: [],
    errores: [],
  };
}
