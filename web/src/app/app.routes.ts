import type { Routes } from '@angular/router';

/**
 * Rutas de la aplicación. Cada página se carga solo cuando se visita (carga diferida).
 * El `title` se completa con el nombre del sitio en `TituloPaginaStrategy`.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/inicio/pages/inicio-page/inicio-page.component').then(
        (m) => m.InicioPageComponent,
      ),
  },
  {
    path: 'calendario',
    title: 'Calendario',
    loadComponent: () =>
      import('@features/calendario/pages/calendario-page/calendario-page.component').then(
        (m) => m.CalendarioPageComponent,
      ),
  },
  {
    path: 'calendario/partido/:idPartido',
    title: 'Partido',
    loadComponent: () =>
      import('@features/calendario/pages/partido-page/partido-page.component').then(
        (m) => m.PartidoPageComponent,
      ),
  },
  {
    path: 'clasificacion',
    title: 'Clasificación',
    loadComponent: () =>
      import('@features/clasificacion/pages/clasificacion-page/clasificacion-page.component').then(
        (m) => m.ClasificacionPageComponent,
      ),
  },
  {
    path: 'plantilla',
    title: 'Plantilla',
    loadComponent: () =>
      import('@features/plantilla/pages/plantilla-page/plantilla-page.component').then(
        (m) => m.PlantillaPageComponent,
      ),
  },
  {
    path: 'jugadores/:idJugador',
    title: 'Jugador',
    loadComponent: () =>
      import('@features/plantilla/pages/ficha-jugador-page/ficha-jugador-page.component').then(
        (m) => m.FichaJugadorPageComponent,
      ),
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas',
    loadComponent: () =>
      import('@features/estadisticas/pages/estadisticas-page/estadisticas-page.component').then(
        (m) => m.EstadisticasPageComponent,
      ),
  },
  {
    path: 'acceso',
    title: 'Acceso',
    loadComponent: () =>
      import('@features/acceso/pages/acceso-page/acceso-page.component').then(
        (m) => m.AccesoPageComponent,
      ),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('@features/no-encontrado/pages/no-encontrado-page/no-encontrado-page.component').then(
        (m) => m.NoEncontradoPageComponent,
      ),
  },
];
