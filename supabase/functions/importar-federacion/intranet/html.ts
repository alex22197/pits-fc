import { DOMParser, type Element, type HTMLDocument } from '@b-fuze/deno-dom';

/** HTML de la intranet → documento consultable con selectores. */
export function analizarHtml(html: string): HTMLDocument {
  const documento = new DOMParser().parseFromString(html, 'text/html');
  if (!documento) {
    throw new Error('No se ha podido interpretar el HTML.');
  }
  return documento;
}

/** Texto de un elemento sin espacios duros ni saltos, con los espacios colapsados. */
export function texto(elemento: Element | null | undefined): string {
  return (elemento?.textContent ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** Todos los elementos que cumplen el selector, ya como `Element`. */
export function todos(raiz: HTMLDocument | Element, selector: string): Element[] {
  return Array.from(raiz.querySelectorAll(selector)) as Element[];
}

/** Primer entero del texto, o `null` si no hay ninguno. */
export function entero(valor: string): number | null {
  const coincidencia = /-?\d+/.exec(valor);
  return coincidencia ? Number(coincidencia[0]) : null;
}

/** Valor de un parámetro en una URL relativa de la intranet (`...?CodActa=93478`). */
export function parametroDeUrl(href: string, nombre: string): string | null {
  const indice = href.indexOf('?');
  if (indice < 0) {
    return null;
  }
  return new URLSearchParams(href.slice(indice + 1).replace(/&amp;/g, '&')).get(nombre);
}
