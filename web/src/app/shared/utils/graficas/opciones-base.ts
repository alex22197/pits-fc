import type { EChartsCoreOption } from 'echarts/core';
import type { ColoresGraficas } from './interfaces/colores-graficas.interface';

/**
 * Piezas comunes de todas las gráficas: marcas finas, rejilla discreta, texto con los
 * colores de texto (nunca con los de las series) y ayudas en texto plano, no HTML.
 */
export function opcionesBase(colores: ColoresGraficas): EChartsCoreOption {
  return {
    textStyle: { fontFamily: colores.fuente, color: colores.textoTenue },
    grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      renderMode: 'richText',
      backgroundColor: colores.superficieElevada,
      borderColor: colores.borde,
      textStyle: { color: colores.texto, fontFamily: colores.fuente },
      axisPointer: { type: 'line', lineStyle: { color: colores.borde } },
    },
    animationDuration: 300,
  };
}

export function leyenda(colores: ColoresGraficas): Record<string, unknown> {
  return {
    top: 0,
    right: 0,
    icon: 'rect',
    itemWidth: 12,
    itemHeight: 8,
    textStyle: { color: colores.textoTenue },
  };
}

export function ejeCategorias(
  colores: ColoresGraficas,
  categorias: readonly string[],
): Record<string, unknown> {
  return {
    type: 'category',
    data: [...categorias],
    axisLine: { lineStyle: { color: colores.rejilla } },
    axisTick: { show: false },
    axisLabel: { color: colores.textoTenue },
  };
}

export function ejeValores(colores: ColoresGraficas): Record<string, unknown> {
  return {
    type: 'value',
    minInterval: 1,
    axisLabel: { color: colores.textoTenue },
    splitLine: { lineStyle: { color: colores.rejilla, type: 'solid' } },
  };
}

/** Barras verticales: 24 px como máximo, extremo redondeado y base cuadrada. */
export function serieBarras(
  nombre: string,
  datos: readonly number[],
  color: string,
): Record<string, unknown> {
  return {
    type: 'bar',
    name: nombre,
    data: [...datos],
    barMaxWidth: 24,
    barGap: '10%',
    itemStyle: { color, borderRadius: [4, 4, 0, 0] },
    emphasis: { itemStyle: { opacity: 0.85 } },
  };
}

/** Barras horizontales, con la etiqueta de valor en la punta. */
export function serieBarrasHorizontales(
  nombre: string,
  datos: readonly number[],
  color: string,
  colores: ColoresGraficas,
  apiladas = false,
): Record<string, unknown> {
  return {
    type: 'bar',
    name: nombre,
    data: [...datos],
    barMaxWidth: 20,
    barGap: '10%',
    stack: apiladas ? 'total' : undefined,
    itemStyle: { color, borderRadius: apiladas ? 0 : [0, 4, 4, 0] },
    emphasis: { itemStyle: { opacity: 0.85 } },
    label: apiladas
      ? { show: false }
      : { show: true, position: 'right', color: colores.textoTenue, fontFamily: colores.fuente },
  };
}

/** Línea de 2 px con marcadores de 10 px rodeados por la superficie y un lavado bajo ella. */
export function serieLinea(
  nombre: string,
  datos: readonly number[],
  color: string,
  colores: ColoresGraficas,
): Record<string, unknown> {
  return {
    type: 'line',
    name: nombre,
    data: [...datos],
    lineStyle: { width: 2, color, cap: 'round', join: 'round' },
    itemStyle: { color, borderColor: colores.superficie, borderWidth: 2 },
    symbol: 'circle',
    symbolSize: 10,
    areaStyle: { color, opacity: 0.1 },
  };
}
