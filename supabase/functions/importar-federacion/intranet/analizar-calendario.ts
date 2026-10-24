import type { JornadaCalendario } from '../interfaces/jornada-calendario.interface.ts';
import type { PartidoCalendario } from '../interfaces/partido-calendario.interface.ts';
import { fechaIso } from '../utils/fechas.ts';
import { analizarHtml, entero, texto, todos } from './html.ts';

const DESCANSA = 'Descansa';

/**
 * Página de calendario (`NFG_VisCalendario_Vis`): un bloque `#trPartidosJornada_N` por
 * jornada, con la fecha en `#fecha_jornada_org_N` y una fila por partido cuyo `id` es el
 * código de acta. Las filas con «Descansa» dicen qué equipo no juega.
 */
export function analizarCalendario(html: string): JornadaCalendario[] {
  const documento = analizarHtml(html);
  return todos(documento, 'div[id^="trPartidosJornada_"]').map((bloque) => {
    const numero = entero(bloque.getAttribute('id') ?? '');
    if (numero === null) {
      throw new Error('Jornada sin número en el calendario.');
    }
    const fecha = fechaIso(texto(bloque.querySelector(`#fecha_jornada_org_${numero}`)));
    if (!fecha) {
      throw new Error(`La jornada ${numero} no tiene fecha en el calendario.`);
    }
    let descansa: string | null = null;
    const partidos: PartidoCalendario[] = [];
    for (const fila of todos(bloque, 'tbody tr')) {
      const celdas = todos(fila, 'td').map(texto);
      if (celdas.length < 5) {
        continue;
      }
      const [local, golesLocal, , golesVisitante, visitante] = celdas;
      if (local === DESCANSA || visitante === DESCANSA) {
        descansa = local === DESCANSA ? visitante : local;
        continue;
      }
      const codActa = fila.getAttribute('id')?.trim();
      if (!codActa) {
        throw new Error(`Partido sin código de acta en la jornada ${numero}.`);
      }
      partidos.push({
        codActa,
        local,
        visitante,
        golesLocal: entero(golesLocal),
        golesVisitante: entero(golesVisitante),
      });
    }
    return { numero, fecha, descansa, partidos };
  });
}
