import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Deja pasar solo a gestores (admin o gestor). Al resto lo lleva a la página de acceso.
 * Es una ayuda de navegación: la protección real de los datos está en la base de datos.
 */
export const gestorGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.esperarInicializacion();
  return auth.esGestor() ? true : router.createUrlTree(['/acceso']);
};
