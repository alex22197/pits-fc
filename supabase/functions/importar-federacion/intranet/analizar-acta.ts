import type {
  Acta,
  EquipoActa,
  GolActa,
  JugadorActa,
  TarjetaActa,
} from '../interfaces/acta.interface.ts';
import { fechaIso, horaNormalizada } from '../utils/fechas.ts';
import { analizarHtml, entero, texto, todos } from './html.ts';

type Elemento = ReturnType<typeof todos>[number];

/**
 * Ficha de partido (`NFG_CmpPartido`): tres columnas. Las de los lados son cada equipo
 * (nombre en `.tituloprograma`, tablas de titulares, suplentes y tarjetas); la central,
 * el marcador (`.IMPRIMIR_TITULO_CABECERA`), los goles y el estadio.
 */
export function analizarActa(html: string): Acta {
  const documento = analizarHtml(html);
  const columnas = todos(documento, '.tituloprograma').map((titulo) => columnaDe(titulo));
  if (columnas.length !== 2) {
    throw new Error('El acta no tiene dos equipos.');
  }
  const cabecera = texto(documento.querySelector('.subtitulos')?.parentElement ?? null);
  const marcador = todos(documento, '.IMPRIMIR_TITULO_CABECERA').map(texto).join(' ');
  const goles = /(\d+)\s*-\s*(\d+)/.exec(marcador);
  return {
    fecha: fechaIso(cabecera),
    hora: horaNormalizada(cabecera.replace(/.*Hora:/, '')),
    golesLocal: goles ? Number(goles[1]) : null,
    golesVisitante: goles ? Number(goles[2]) : null,
    campo: campoDe(documento.body as Elemento),
    local: equipoDe(columnas[0]),
    visitante: equipoDe(columnas[1]),
    goles: golesDe(documento.body as Elemento),
  };
}

/** La celda de columna que contiene el título del equipo. */
function columnaDe(titulo: Elemento): Elemento {
  let actual: Elemento | null = titulo;
  while (actual && actual.tagName !== 'TD') {
    actual = actual.parentElement as Elemento | null;
  }
  if (!actual) {
    throw new Error('El título del equipo no está en una columna.');
  }
  return actual;
}

function equipoDe(columna: Elemento): EquipoActa {
  const titulares = tablaTras(columna, 'Titulares:');
  const suplentes = tablaTras(columna, 'Suplentes:');
  return {
    nombre: texto(columna.querySelector('.tituloprograma')),
    titulares: titulares ? jugadoresDe(titulares) : [],
    suplentes: suplentes ? jugadoresDe(suplentes) : [],
    tarjetas: tarjetasDe(columna),
  };
}

/** La primera tabla que viene después del `span` con esa etiqueta. */
function tablaTras(columna: Elemento, etiqueta: string): Elemento | null {
  const marca = todos(columna, 'span.title').find((span) => texto(span) === etiqueta);
  let siguiente = (marca?.nextElementSibling ?? null) as Elemento | null;
  while (siguiente && siguiente.tagName !== 'TABLE') {
    siguiente = siguiente.nextElementSibling as Elemento | null;
  }
  return siguiente;
}

function jugadoresDe(tabla: Elemento): JugadorActa[] {
  return todos(tabla, 'tr')
    .map((fila) => todos(fila, 'td').map(texto))
    .filter((celdas) => celdas.length >= 2 && celdas[1].length > 0)
    .map(([dorsal, nombre]) => ({ dorsal: entero(dorsal), nombre }));
}

function tarjetasDe(columna: Elemento): TarjetaActa[] {
  return todos(columna, 'img[src*="tarj_"]').map((imagen) => {
    const fila = imagen.closest('tr') as Elemento | null;
    const descripcion = texto(fila?.querySelector('.textosm') ?? null);
    return {
      nombre: descripcion.replace(/\s*\(\d+'?\)\s*$/, '').trim(),
      tipo: (imagen.getAttribute('src') ?? '').includes('amar') ? 'amarilla' : 'roja',
      minuto: minutoDe(descripcion),
    };
  });
}

function golesDe(raiz: Elemento): GolActa[] {
  return todos(raiz, 'td.tit4')
    .map((celda) => {
      const marcador = /(\d+)\s*-\s*(\d+)/.exec(texto(celda));
      const descripcion = texto(celda.nextElementSibling as Elemento | null);
      if (!marcador) {
        return null;
      }
      return {
        marcadorLocal: Number(marcador[1]),
        marcadorVisitante: Number(marcador[2]),
        nombre: descripcion.replace(/\s*\(\d+'?\)\s*$/, '').trim(),
        minuto: minutoDe(descripcion),
      };
    })
    .filter((gol): gol is GolActa => gol !== null);
}

/** «NOMBRE (24')» → 24. */
function minutoDe(descripcion: string): number | null {
  const coincidencia = /\((\d+)'?\)\s*$/.exec(descripcion);
  return coincidencia ? Number(coincidencia[1]) : null;
}

function campoDe(raiz: Elemento): string | null {
  const etiqueta = todos(raiz, 'span.subtitulos').find((span) => texto(span) === 'ESTADIO:');
  const campo = texto(etiqueta?.parentElement as Elemento | null).replace(/^ESTADIO:\s*/, '')
    .trim();
  return campo.length > 0 ? campo : null;
}
