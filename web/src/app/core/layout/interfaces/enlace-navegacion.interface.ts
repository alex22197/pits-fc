import type { NombreIcono } from '@shared/components/icono/interfaces/nombre-icono.type';

/** Una entrada del menú principal. */
export interface EnlaceNavegacion {
  readonly ruta: string;
  readonly etiqueta: string;
  readonly icono: NombreIcono;
  /** `true` para que «Inicio» no aparezca activo en todas las páginas. */
  readonly coincidenciaExacta: boolean;
}
