import { createClient } from '@supabase/supabase-js';
import type { Llamante } from './interfaces/llamante.type.ts';

/**
 * Quién llama a la función: el cron de la base de datos (con la clave de servicio) o un
 * gestor desde la web (con su sesión). Cualquier otra llamada se rechaza.
 */
export async function identificarLlamante(peticion: Request): Promise<Llamante | null> {
  const cabecera = peticion.headers.get('Authorization') ?? '';
  const token = cabecera.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return null;
  }
  if (token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    return 'servicio';
  }
  return (await esGestor(token)) ? 'gestor' : null;
}

/** Pregunta a la base de datos, con la sesión del usuario, si tiene rol de gestión. */
async function esGestor(tokenUsuario: string): Promise<boolean> {
  const cliente = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${tokenUsuario}` } } },
  );
  const { data, error } = await cliente.rpc('es_gestor');
  if (error) {
    console.warn('No se ha podido comprobar el rol del llamante', error.message);
    return false;
  }
  return data === true;
}
