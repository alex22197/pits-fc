import type { EstadoConvocatoria } from '@data-access/convocatorias/interfaces/estado-convocatoria.type';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Decisiones } from '../interfaces/decisiones.type';

/** Cambia la situación de un jugador; al dejar de ser convocado pierde el puesto. `null` lo quita. */
export function decidirEstado(
  decisiones: Decisiones,
  jugadorId: string,
  estado: EstadoConvocatoria | null,
): Decisiones {
  const nuevo = new Map(decisiones);
  const actual = decisiones.get(jugadorId);
  if (estado === null) {
    nuevo.delete(jugadorId);
  } else {
    nuevo.set(jugadorId, {
      jugadorId,
      estado,
      puesto: estado === 'convocado' ? (actual?.puesto ?? null) : null,
      nota: actual?.nota ?? null,
    });
  }
  return nuevo;
}

/** Pone a un jugador de titular en un puesto; quien lo ocupara pasa al banquillo. */
export function colocarEnPuesto(
  decisiones: Decisiones,
  jugadorId: string,
  puesto: PuestoAlineacion,
): Decisiones {
  const nuevo = new Map(vaciarPuesto(decisiones, puesto));
  nuevo.set(jugadorId, {
    jugadorId,
    estado: 'convocado',
    puesto,
    nota: decisiones.get(jugadorId)?.nota ?? null,
  });
  return nuevo;
}

/** Deja un puesto libre: su titular sigue convocado, en el banquillo. */
export function vaciarPuesto(decisiones: Decisiones, puesto: PuestoAlineacion): Decisiones {
  const nuevo = new Map(decisiones);
  for (const decision of decisiones.values()) {
    if (decision.puesto === puesto) {
      nuevo.set(decision.jugadorId, { ...decision, puesto: null });
    }
  }
  return nuevo;
}

export function anotarNota(decisiones: Decisiones, jugadorId: string, nota: string): Decisiones {
  const decision = decisiones.get(jugadorId);
  if (!decision) {
    return decisiones;
  }
  return new Map(decisiones).set(jugadorId, { ...decision, nota: nota.trim() || null });
}
