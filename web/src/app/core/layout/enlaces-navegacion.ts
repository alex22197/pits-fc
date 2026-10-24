import type { EnlaceNavegacion } from './interfaces/enlace-navegacion.interface';

/** Menú principal, compartido por la cabecera (escritorio) y la barra inferior (móvil). */
export const ENLACES_NAVEGACION: readonly EnlaceNavegacion[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: 'inicio', coincidenciaExacta: true },
  { ruta: '/calendario', etiqueta: 'Calendario', icono: 'calendario', coincidenciaExacta: false },
  {
    ruta: '/clasificacion',
    etiqueta: 'Clasificación',
    icono: 'clasificacion',
    coincidenciaExacta: false,
  },
  { ruta: '/plantilla', etiqueta: 'Plantilla', icono: 'plantilla', coincidenciaExacta: false },
  {
    ruta: '/estadisticas',
    etiqueta: 'Estadísticas',
    icono: 'estadisticas',
    coincidenciaExacta: false,
  },
];
