import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import type { Alineacion } from './interfaces/alineacion.type';

/** El puesto que ocupa un jugador, o `null` si no está en el campo. */
export function puestoDe(alineacion: Alineacion, jugadorId: string): PuestoAlineacion | null {
  for (const [puesto, jugador] of alineacion) {
    if (jugador.id === jugadorId) {
      return puesto;
    }
  }
  return null;
}

/**
 * Pone a un jugador en un puesto. Si ya estaba en otro, quien ocupara el destino se cambia a
 * su sitio; si venía de fuera, quien ocupara el destino sale del campo.
 */
export function colocarEnAlineacion(
  alineacion: Alineacion,
  jugador: Jugador,
  destino: PuestoAlineacion,
): Alineacion {
  const origen = puestoDe(alineacion, jugador.id);
  const ocupante = alineacion.get(destino);
  const nueva = new Map(alineacion);
  if (origen) {
    nueva.delete(origen);
    if (ocupante && ocupante.id !== jugador.id) {
      nueva.set(origen, ocupante);
    }
  }
  nueva.set(destino, jugador);
  return nueva;
}

/** Saca a un jugador del campo; si no estaba, no cambia nada. */
export function sacarDeAlineacion(alineacion: Alineacion, jugadorId: string): Alineacion {
  const puesto = puestoDe(alineacion, jugadorId);
  if (!puesto) {
    return alineacion;
  }
  const nueva = new Map(alineacion);
  nueva.delete(puesto);
  return nueva;
}
