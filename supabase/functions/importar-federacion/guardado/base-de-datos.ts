import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  CompeticionBd,
  Contexto,
  EquipoBd,
  JornadaBd,
  PartidoBd,
} from '../interfaces/contexto.interface.ts';

/** Cliente con la clave de servicio: escribe sin pasar por RLS. Solo dentro de la función. */
export function clienteDeServicio(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const clave = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !clave) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Lanza un error con mensaje en castellano si la respuesta de Supabase trae error. */
export function exigir<T>(
  resultado: { data: T; error: { message: string } | null },
  que: string,
): T {
  if (resultado.error) {
    throw new Error(`${que}: ${resultado.error.message}`);
  }
  return resultado.data;
}

/** Carga competición activa, equipos, jornadas y partidos. */
export async function cargarContexto(db: SupabaseClient): Promise<Contexto> {
  const competicion = exigir(
    await db
      .from('competicion')
      .select('id, cod_competicion, cod_grupo, cod_temporada')
      .eq('activa', true)
      .order('temporada', { ascending: false })
      .limit(1)
      .maybeSingle(),
    'No se ha podido leer la competición',
  ) as CompeticionBd | null;
  if (!competicion) {
    throw new Error('No hay ninguna competición activa.');
  }
  const equipos = (exigir(
    await db.from('equipo').select('id, nombre_federacion, cod_equipo, es_nuestro'),
    'No se han podido leer los equipos',
  ) ?? []) as EquipoBd[];
  const nuestro = equipos.find((equipo) => equipo.es_nuestro);
  if (!nuestro) {
    throw new Error('Nuestro equipo no está dado de alta.');
  }
  const jornadas = (exigir(
    await db
      .from('jornada')
      .select('id, numero, fecha_prevista, descansa_id')
      .eq('competicion_id', competicion.id)
      .order('numero'),
    'No se han podido leer las jornadas',
  ) ?? []) as JornadaBd[];
  const partidos = (exigir(
    await db
      .from('partido')
      .select(
        'id, jornada_id, local_id, visitante_id, estado, cod_acta, fecha_hora, acta_importada_en',
      )
      .in(
        'jornada_id',
        jornadas.map((jornada) => jornada.id),
      ),
    'No se han podido leer los partidos',
  ) ?? []) as PartidoBd[];
  return { competicion, nuestro, equipos, jornadas, partidos };
}
