import type { Competicion } from './interfaces/competicion.interface';
import type { FilaCompeticion } from './interfaces/fila-competicion.type';

/** Fila de `competicion` → `Competicion` de dominio. */
export function mapearCompeticion(fila: FilaCompeticion): Competicion {
  return {
    id: fila.id,
    nombre: fila.nombre,
    temporada: fila.temporada,
    grupo: fila.grupo,
    activa: fila.activa,
  };
}
