import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import type { Entorno } from '@environments/entorno.interface';

/**
 * Configuración del entorno inyectable. Inyectarla (en lugar de importar `environment`)
 * permite sustituirla en los tests.
 */
export const ENTORNO = new InjectionToken<Entorno>('ENTORNO', {
  providedIn: 'root',
  factory: () => environment,
});
