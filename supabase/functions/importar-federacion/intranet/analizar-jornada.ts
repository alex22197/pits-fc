import type { PartidoJornada } from '../interfaces/partido-jornada.interface.ts';
import { fechaIso, horaNormalizada } from '../utils/fechas.ts';
import { analizarHtml, parametroDeUrl, texto, todos } from './html.ts';

type Elemento = ReturnType<typeof todos>[number];

const DESCANSA = 'Descansa';

/**
 * Página de jornada (`NFG_CmpJornada`): un bloque `.portlet-body` por partido. La primera fila
 * de su tabla lleva los dos equipos (enlaces a `NFG_VisEquipos`), el marcador en `h4` y la
 * fecha y hora en `h5`; la fila de debajo, el enlace al acta y el campo.
 */
export function analizarJornada(html: string): PartidoJornada[] {
  const documento = analizarHtml(html);
  const partidos: PartidoJornada[] = [];
  for (const bloque of todos(documento, '.portlet-body')) {
    const equipos = todos(bloque, 'a[href*="Codigo_Equipo="]').map(texto);
    if (equipos.length < 2 || texto(bloque).includes(DESCANSA)) {
      continue;
    }
    const [local, visitante] = equipos;
    const marcador = /(\d+)\s*-\s*(\d+)/.exec(texto(bloque.querySelector('h4')));
    const detalles = todos(bloque, 'h5 span').map(texto);
    const enlaceActa = bloque.querySelector('a[href*="CodActa="]');
    partidos.push({
      codActa: enlaceActa ? parametroDeUrl(enlaceActa.getAttribute('href') ?? '', 'CodActa') : null,
      local,
      visitante,
      fecha: detalles.map(fechaIso).find((valor) => valor !== null) ?? null,
      hora: detalles.map(horaNormalizada).find((valor) => valor !== null) ?? null,
      campo: campoDe(bloque),
      golesLocal: marcador ? Number(marcador[1]) : null,
      golesVisitante: marcador ? Number(marcador[2]) : null,
    });
  }
  return partidos;
}

/** El texto que sigue a «Campo:» en su celda, o `null` si no hay campo asignado. */
function campoDe(bloque: Elemento): string | null {
  const celda = todos(bloque, 'td').find((candidata) => texto(candidata).startsWith('Campo:'));
  const campo = texto(celda).replace(/^Campo:\s*/, '').trim();
  return campo.length > 0 ? campo : null;
}
