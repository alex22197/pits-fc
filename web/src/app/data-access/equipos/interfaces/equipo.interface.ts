/** Un equipo del grupo. `nombre` es el que se muestra; `nombreFederacion`, el de la intranet. */
export interface Equipo {
  readonly id: string;
  readonly nombre: string;
  readonly nombreFederacion: string;
  readonly esNuestro: boolean;
}
