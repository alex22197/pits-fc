import { createClient } from '@supabase/supabase-js';
import type { Llamante } from './interfaces/llamante.type.ts';

/**
 * Quién llama a la función: el cron de la base de datos (con una clave de servicio, la
 * antigua `eyJ…` o la nueva `sb_secret_…`) o un gestor desde la web (con su sesión).
 * Cualquier otra llamada se rechaza. No se compara texto: se comprueba contra la base de
 * datos qué puede hacer el token.
 */
export async function identificarLlamante(peticion: Request): Promise<Llamante | null> {
  const cabecera = peticion.headers.get('Authorization') ?? '';
  const token = cabecera.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return null;
  }
  if (await esClaveDeServicio(token)) {
    return 'servicio';
  }
  return (await esGestor(token)) ? 'gestor' : null;
}

/**
 * Una clave de servicio salta las políticas RLS: puede leer `ejecucion_scraper` usándose como
 * clave de API. Una clave pública o un token de usuario, no.
 */
async function esClaveDeServicio(token: string): Promise<boolean> {
  if (token.startsWith('sb_publishable_')) {
    return false;
  }
  const cliente = createClient(Deno.env.get('SUPABASE_URL') ?? '', token, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await cliente.from('ejecucion_scraper').select('id').limit(1);
  return error === null;
}

/** Pregunta a la base de datos, con la sesión del usuario, si tiene rol de gestión. */
async function esGestor(tokenUsuario: string): Promise<boolean> {
  const cliente = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${tokenUsuario}` } },
    },
  );
  const { data, error } = await cliente.rpc('es_gestor');
  if (error) {
    console.warn('No se ha podido comprobar el rol del llamante', error.message);
    return false;
  }
  return data === true;
}
