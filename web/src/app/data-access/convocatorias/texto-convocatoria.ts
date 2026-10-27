import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import type { Convocado } from './interfaces/convocado.interface';
import type { FormatearFecha } from './interfaces/formatear-fecha.type';
import { banquillo, nombreDelPuesto } from './puestos';

/**
 * La convocatoria como texto para pegar en WhatsApp: rival, cuándo, dónde, los titulares con
 * su puesto y el banquillo; dudas y descartados aparte si los hay.
 */
export function textoConvocatoria(
  partido: Partido,
  convocados: readonly Convocado[],
  formatearFecha: FormatearFecha,
): string {
  const rival = partido.local.esNuestro ? partido.visitante.nombre : partido.local.nombre;
  const titulares = convocados.filter((c) => c.estado === 'convocado' && c.puesto !== null);
  const lineas = [
    `*Convocatoria · Jornada ${partido.jornadaNumero}*`,
    `${partido.local.esNuestro ? 'PITS FC - ' + rival : rival + ' - PITS FC'}`,
    formatearFecha(partido),
    ...(partido.campo ? [partido.campo] : []),
    '',
    ...bloque('Titulares', titulares, (c) => (c.puesto ? ` · ${nombreDelPuesto(c.puesto)}` : '')),
    ...bloque('Banquillo', banquillo(convocados)),
    ...bloque(
      'Dudas',
      convocados.filter((c) => c.estado === 'duda'),
    ),
    ...bloque(
      'No van',
      convocados.filter((c) => c.estado === 'descartado'),
    ),
  ];
  return lineas.join('\n').trim();
}

function bloque(
  titulo: string,
  lista: readonly Convocado[],
  detalle: (c: Convocado) => string = () => '',
): string[] {
  if (lista.length === 0) {
    return [];
  }
  return [
    `*${titulo}*`,
    ...lista.map((c) => {
      const dorsal = c.jugador.dorsal !== null ? `${c.jugador.dorsal}. ` : '';
      const nota = c.nota ? ` (${c.nota})` : '';
      return `${dorsal}${c.jugador.nombreMostrar}${detalle(c)}${nota}`;
    }),
    '',
  ];
}
