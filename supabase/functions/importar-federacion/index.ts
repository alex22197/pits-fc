import { identificarLlamante } from './autorizacion.ts';
import { importar } from './importar.ts';

/**
 * Scraper de la federación. La llama el cron de la base de datos cada semana y, a mano, un
 * gestor desde la web. Documentación en docs/scraper.md.
 */
const CABECERAS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (peticion) => {
  if (peticion.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CABECERAS });
  }
  if (peticion.method !== 'POST') {
    return respuesta({ error: 'Solo se admite POST.' }, 405);
  }
  const llamante = await identificarLlamante(peticion);
  if (!llamante) {
    return respuesta({ error: 'No autorizado.' }, 401);
  }
  const { estado, resumen } = await importar(llamante);
  return respuesta({ estado, resumen }, estado === 'ok' ? 200 : 500);
});

function respuesta(cuerpo: unknown, estado: number): Response {
  return new Response(JSON.stringify(cuerpo), { status: estado, headers: CABECERAS });
}
