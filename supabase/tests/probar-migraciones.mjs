// Ejecuta todas las migraciones, en orden, en un PostgreSQL embebido (PGlite) y comprueba lo
// esencial del modelo: datos iniciales, reglas de los triggers y permisos RLS de un visitante.
//
// No sustituye a probar en Supabase (aquí `auth` y los roles son de mentira), pero pilla casi
// todos los errores sin Docker ni red. Uso: `npm run db:probar` en la raíz del repositorio.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { parse } from 'libpg-query';

const directorioMigraciones = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const migraciones = readdirSync(directorioMigraciones)
  .filter((fichero) => fichero.endsWith('.sql'))
  .sort();

const db = new PGlite();
let fallos = 0;

/** Lo que Supabase ya trae y las migraciones dan por hecho. */
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
`);

for (const migracion of migraciones) {
  const sql = readFileSync(join(directorioMigraciones, migracion), 'utf8');
  try {
    await parse(sql);
    await db.exec(sql);
    console.log(`ok    ${migracion}`);
  } catch (error) {
    console.error(`FALLO ${migracion}\n      ${error.message}`);
    process.exit(1);
  }
}

async function contar(consulta) {
  const { rows } = await db.query(consulta);
  return Number(rows[0].n);
}

async function rechaza(sql) {
  try {
    await db.exec(sql);
    return false;
  } catch {
    return true;
  }
}

function comprobar(nombre, condicion) {
  if (!condicion) {
    fallos += 1;
  }
  console.log(`${condicion ? 'ok   ' : 'FALLO'} ${nombre}`);
}

const partidoPits = (jornada) => `
  select p.id from public.partido p
  join public.jornada j on j.id = p.jornada_id
  where j.numero = ${jornada} and public.id_equipo('PITS') in (p.local_id, p.visitante_id)`;

// Datos iniciales.
comprobar('13 equipos, uno nuestro', (await contar('select count(*) n from public.equipo')) === 13
  && (await contar('select count(*) n from public.equipo where es_nuestro')) === 1);
comprobar('26 jornadas, todas con descanso', (await contar('select count(*) n from public.jornada where descansa_id is not null')) === 26);
comprobar('156 partidos', (await contar('select count(*) n from public.partido')) === 156);
comprobar('cada equipo juega 24 partidos', (await contar(`
  select count(*) n from (
    select e.id, count(p.id) jugados from public.equipo e
    join public.partido p on e.id in (p.local_id, p.visitante_id) group by e.id
  ) t where jugados = 24`)) === 13);
comprobar('el que descansa no juega', (await contar(`
  select count(*) n from public.partido p join public.jornada j on j.id = p.jornada_id
  where j.descansa_id in (p.local_id, p.visitante_id)`)) === 0);
comprobar('9 partidos jugados al cargar', (await contar(`select count(*) n from public.partido where estado = 'jugado'`)) === 9);

// Reglas de los triggers.
comprobar('gol de un equipo que no juega: rechazado', await rechaza(`
  insert into public.gol (partido_id, equipo_id, marcador_local, marcador_visitante)
  select id, public.id_equipo('HATHOR C.F'), 1, 0 from (${partidoPits(2)}) p`));

await db.exec(`insert into public.jugador (nombre_mostrar, dorsal, posicion) values ('Prueba', 10, 'delantero')`);
await db.exec(`
  insert into public.participacion (partido_id, jugador_id, titular)
  select p.id, j.id, true from (${partidoPits(2)}) p, public.jugador j`);
await db.exec(`
  insert into public.gol (partido_id, equipo_id, jugador_id, minuto, marcador_local, marcador_visitante)
  select p.id, public.id_equipo('PITS'), j.id, 24, 1, 0 from (${partidoPits(2)}) p, public.jugador j`);
await db.exec(`
  insert into public.gol (partido_id, equipo_id, minuto, marcador_local, marcador_visitante)
  select id, public.id_equipo('PRIDE OF SPARTA'), 28, 1, 1 from (${partidoPits(2)}) p`);

const { rows: [estadisticas] } = await db.query('select * from public.estadisticas_jugador');
comprobar('vista estadisticas_jugador', estadisticas.partidos === 1 && estadisticas.titularidades === 1
  && estadisticas.goles === 1 && estadisticas.goles_encajados === 1 && estadisticas.amarillas === 0);

comprobar('gol rival con autor: rechazado', await rechaza(`
  insert into public.gol (partido_id, equipo_id, jugador_id, marcador_local, marcador_visitante)
  select p.id, public.id_equipo('PRIDE OF SPARTA'), j.id, 2, 1 from (${partidoPits(2)}) p, public.jugador j`));
comprobar('convocatoria en un partido ajeno: rechazada', await rechaza(`
  insert into public.convocatoria (partido_id, jugador_id)
  select p.id, j.id from public.partido p join public.jornada jo on jo.id = p.jornada_id, public.jugador j
  where jo.numero = 1 and p.local_id = public.id_equipo('C.D. MONTEJO')`));
comprobar('marcador sin estado jugado: rechazado', await rechaza(`
  update public.partido set goles_local = 1 where id in (${partidoPits(3)})`));

// Permisos de un visitante (rol anon).
await db.exec(`insert into public.jugador_privado (jugador_id, nombre_federacion) select id, 'APELLIDO, NOMBRE' from public.jugador`);
await db.exec(`insert into public.convocatoria (partido_id, jugador_id) select p.id, j.id from (${partidoPits(3)}) p, public.jugador j`);
await db.exec('set role anon');
comprobar('visitante lee los partidos', (await contar('select count(*) n from public.partido')) === 156);
comprobar('visitante lee las estadísticas', (await contar('select count(*) n from public.estadisticas_jugador')) === 1);
comprobar('visitante no ve la convocatoria sin publicar', (await contar('select count(*) n from public.convocatoria')) === 0);
comprobar('visitante no accede a jugador_privado', await rechaza('select * from public.jugador_privado'));
comprobar('visitante no accede al registro del scraper', await rechaza('select * from public.ejecucion_scraper'));
comprobar('visitante no escribe jugadores', await rechaza(`insert into public.jugador (nombre_mostrar) values ('Intruso')`));
await db.exec('reset role');
await db.exec('update public.partido set convocatoria_publicada = true where id in (select partido_id from public.convocatoria)');
await db.exec('set role anon');
comprobar('visitante ve la convocatoria publicada', (await contar('select count(*) n from public.convocatoria')) === 1);
await db.exec('reset role');

await db.close();
if (fallos > 0) {
  console.error(`\n${fallos} comprobaciones han fallado.`);
  process.exit(1);
}
console.log('\nTodas las migraciones y comprobaciones han pasado.');
