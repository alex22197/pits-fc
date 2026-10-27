import type { EjecucionImportacion } from './interfaces/ejecucion-importacion.interface';
import type { FilaEjecucion } from './interfaces/fila-ejecucion.type';

/** Fila de `ejecucion_scraper` → `EjecucionImportacion`; el resumen es JSON libre y se lee con cuidado. */
export function mapearEjecucion(fila: FilaEjecucion): EjecucionImportacion {
  const resumen = esObjeto(fila.resumen) ? fila.resumen : {};
  return {
    id: fila.id,
    inicio: new Date(fila.inicio),
    fin: fila.fin ? new Date(fila.fin) : null,
    estado: fila.estado,
    llamante: typeof resumen['llamante'] === 'string' ? resumen['llamante'] : null,
    partidosActualizados: numero(resumen['partidosActualizados']),
    filasClasificacion: numero(resumen['filasClasificacion']),
    actasImportadas: numero(resumen['actasImportadas']),
    jugadoresNuevos: textos(resumen['jugadoresNuevos']),
    avisos: textos(resumen['avisos']),
    errores: textos(resumen['errores']),
  };
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function numero(valor: unknown): number {
  return typeof valor === 'number' ? valor : 0;
}

function textos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((v): v is string => typeof v === 'string') : [];
}
