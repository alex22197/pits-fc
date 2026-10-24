import type { PartidoBd } from '../interfaces/contexto.interface.ts';

type Estado = PartidoBd['estado'];

/** Un partido sin resultado se da por aplazado cuando su fecha ha pasado con este margen. */
const DIAS_DE_MARGEN = 2;

/**
 * Qué estado le toca a un partido según lo que dice la federación:
 * - con marcador, `jugado`;
 * - sin marcador y con una fecha u hora que aún no ha llegado, `programado`;
 * - sin marcador y con la fecha pasada, `aplazado` (la intranet no lo dice; se deduce);
 * - `suspendido` se respeta si ya lo estaba, porque solo lo pone un gestor a mano.
 */
export function estadoDePartido(datos: {
  readonly jugado: boolean;
  /** Fecha y hora reales del partido (ISO), si la federación las ha fijado. */
  readonly fechaHora: string | null;
  /** Fecha prevista de la jornada, `AAAA-MM-DD`. */
  readonly fechaPrevista: string;
  readonly hoy: string;
  readonly estadoActual: Estado | null;
}): Estado {
  if (datos.jugado) {
    return 'jugado';
  }
  if (datos.estadoActual === 'suspendido') {
    return 'suspendido';
  }
  const referencia = datos.fechaHora ? datos.fechaHora.slice(0, 10) : datos.fechaPrevista;
  return referencia < restarDias(datos.hoy, DIAS_DE_MARGEN) ? 'aplazado' : 'programado';
}

function restarDias(fecha: string, dias: number): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia - dias)).toISOString().slice(0, 10);
}
