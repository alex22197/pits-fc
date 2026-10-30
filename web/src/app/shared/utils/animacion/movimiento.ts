/** Tiempos comunes de las animaciones con GSAP, en segundos. */
export const MOVIMIENTO = {
  /** Una ficha que vuela de un sitio a otro. */
  vuelo: 0.6,
  /** Una ficha que cae en su puesto. */
  caida: 0.5,
  /** Separación entre elementos que se animan uno detrás de otro. */
  escalonado: 0.07,
  /** Dibujar las líneas del campo. */
  trazo: 0.9,
} as const;

/** Si la persona ha pedido menos movimiento en su sistema: entonces no se anima nada. */
export function movimientoReducido(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
