import type { Entorno } from './entorno.interface';

/**
 * Configuración para `npm start`. Apunta al mismo proyecto de Supabase que producción
 * mientras no haya uno de desarrollo (ver docs/entorno-local.md).
 */
export const environment: Entorno = {
  produccion: false,
  supabase: {
    url: 'https://pendiente.supabase.co',
    publishableKey: 'sb_publishable_pendiente',
  },
};
