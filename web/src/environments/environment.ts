import type { Entorno } from './entorno.interface';

/**
 * Configuración de producción. La publishable key es pública por diseño:
 * lo que protege los datos son las reglas de acceso (RLS) de la base de datos.
 *
 * Pendiente: sustituir por los valores del proyecto de Supabase de PITS FC
 * (ver docs/entorno-local.md).
 */
export const environment: Entorno = {
  produccion: true,
  supabase: {
    url: 'https://pendiente.supabase.co',
    publishableKey: 'sb_publishable_pendiente',
  },
};
