import type { FilaClasificacionFederacion } from '../interfaces/fila-clasificacion-federacion.interface.ts';
import { analizarHtml, entero, texto, todos } from './html.ts';

/**
 * Página de clasificación (`NFG_VisClasificacion`). Trae dos tablas de clasificación: la
 * detallada (casa y fuera) y la resumida. Se lee la resumida: la que tiene «Últimos» en la
 * cabecera y no «Partidos Casa». Cada fila lleva el código del equipo en su `id`.
 */
export function analizarClasificacion(html: string): FilaClasificacionFederacion[] {
  const documento = analizarHtml(html);
  const tabla = todos(documento, 'table').find((candidata) => {
    const cabecera = texto(candidata.querySelector('thead'));
    return cabecera.includes('Últimos') && !cabecera.includes('Partidos Casa');
  });
  if (!tabla) {
    throw new Error('No se encuentra la tabla de clasificación.');
  }
  const filas: FilaClasificacionFederacion[] = [];
  for (const fila of todos(tabla, 'tbody tr')) {
    const celdas = todos(fila, 'td');
    if (celdas.length < 12) {
      continue;
    }
    const codEquipo = /^(\d+)/.exec(fila.getAttribute('id') ?? '')?.[1];
    if (!codEquipo) {
      throw new Error('Fila de clasificación sin código de equipo.');
    }
    const numero = (indice: number): number => {
      const valor = entero(texto(celdas[indice]));
      if (valor === null) {
        throw new Error(`Valor no numérico en la clasificación de ${texto(celdas[2])}.`);
      }
      return valor;
    };
    filas.push({
      posicion: numero(1),
      codEquipo,
      nombre: texto(celdas[2]),
      puntos: numero(3),
      jugados: numero(4),
      ganados: numero(5),
      empatados: numero(6),
      perdidos: numero(7),
      golesFavor: numero(8),
      golesContra: numero(9),
      ultimos: todos(celdas[10], 'span').map(texto).join(' ').trim(),
      sancion: entero(texto(celdas[11])) ?? 0,
    });
  }
  return filas;
}
