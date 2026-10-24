-- Modelo de datos del equipo: competición, equipos, jornadas, partidos, clasificación,
-- jugadores, lo que pasa en cada partido (participaciones, goles, tarjetas), convocatorias y
-- registro del scraper. Diseño en docs/base-de-datos.md.

-- ---------------------------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------------------------

create type public.estado_partido as enum ('programado', 'jugado', 'aplazado', 'suspendido');
create type public.posicion_jugador as enum ('portero', 'defensa', 'centrocampista', 'delantero');
create type public.tipo_tarjeta as enum ('amarilla', 'roja');
create type public.estado_convocatoria as enum ('convocado', 'duda', 'descartado');
create type public.estado_ejecucion as enum ('ok', 'error');

-- ---------------------------------------------------------------------------------------------
-- Funciones de apoyo
-- ---------------------------------------------------------------------------------------------

-- Mantiene `updated_at` al día en las tablas que lo tienen.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- Competición y calendario
-- ---------------------------------------------------------------------------------------------

-- Una liga y temporada. Los `cod_*` son los identificadores de la intranet de la federación,
-- con los que el scraper sabe qué páginas leer.
create table public.competicion (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  temporada        text not null,
  grupo            text not null,
  cod_competicion  text not null,
  cod_grupo        text not null,
  cod_temporada    text not null,
  activa           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (nombre, temporada, grupo),
  unique (cod_competicion, cod_grupo, cod_temporada)
);

-- Equipos del grupo. `nombre_federacion` es el texto exacto de la intranet; `nombre`, cómo se
-- muestra en la web. Solo uno puede ser el nuestro.
create table public.equipo (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null unique,
  nombre_federacion  text not null unique,
  cod_equipo         text unique,
  es_nuestro         boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create unique index equipo_solo_uno_nuestro on public.equipo (es_nuestro) where es_nuestro;

-- Jornada del calendario. Con 13 equipos, uno descansa cada jornada.
create table public.jornada (
  id              uuid primary key default gen_random_uuid(),
  competicion_id  uuid not null references public.competicion (id) on delete cascade,
  numero          integer not null check (numero > 0),
  vuelta          smallint not null check (vuelta in (1, 2)),
  fecha_prevista  date not null,
  descansa_id     uuid references public.equipo (id) on delete restrict,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (competicion_id, numero)
);

-- Un partido del grupo. El marcador solo existe cuando está jugado.
create table public.partido (
  id                      uuid primary key default gen_random_uuid(),
  jornada_id              uuid not null references public.jornada (id) on delete cascade,
  local_id                uuid not null references public.equipo (id) on delete restrict,
  visitante_id            uuid not null references public.equipo (id) on delete restrict,
  fecha_hora              timestamptz,
  campo                   text,
  estado                  public.estado_partido not null default 'programado',
  goles_local             integer check (goles_local >= 0),
  goles_visitante         integer check (goles_visitante >= 0),
  cod_acta                text unique,
  acta_importada_en       timestamptz,
  convocatoria_publicada  boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  check (local_id <> visitante_id),
  constraint marcador_solo_si_jugado check (
    case
      when estado = 'jugado' then goles_local is not null and goles_visitante is not null
      else goles_local is null and goles_visitante is null
    end
  ),
  unique (jornada_id, local_id),
  unique (jornada_id, visitante_id)
);

create index partido_por_fecha on public.partido (fecha_hora);

-- Clasificación tal como la publica la federación. Se sobrescribe en cada importación: no se
-- calcula, porque las sanciones solo las conoce la federación.
create table public.clasificacion (
  competicion_id  uuid not null references public.competicion (id) on delete cascade,
  equipo_id       uuid not null references public.equipo (id) on delete cascade,
  posicion        integer not null check (posicion > 0),
  puntos          integer not null default 0,
  jugados         integer not null default 0 check (jugados >= 0),
  ganados         integer not null default 0 check (ganados >= 0),
  empatados       integer not null default 0 check (empatados >= 0),
  perdidos        integer not null default 0 check (perdidos >= 0),
  goles_favor     integer not null default 0 check (goles_favor >= 0),
  goles_contra    integer not null default 0 check (goles_contra >= 0),
  sancion         integer not null default 0,
  ultimos         text not null default '',  -- últimos resultados, p. ej. «G E P»
  actualizado_en  timestamptz not null default now(),
  primary key (competicion_id, equipo_id),
  unique (competicion_id, posicion) deferrable initially deferred,
  check (jugados = ganados + empatados + perdidos)
);

-- ---------------------------------------------------------------------------------------------
-- Jugadores
-- ---------------------------------------------------------------------------------------------

-- Solo nuestros jugadores, con lo que ve el público (ADR 0004).
create table public.jugador (
  id              uuid primary key default gen_random_uuid(),
  nombre_mostrar  text not null unique,
  dorsal          integer check (dorsal between 1 and 99),
  posicion        public.posicion_jugador,
  activo          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index jugador_dorsal_unico_entre_activos
  on public.jugador (dorsal)
  where activo and dorsal is not null;

-- Nombre tal como figura en las actas, para que el scraper reconozca a cada uno. Solo gestores.
create table public.jugador_privado (
  jugador_id         uuid primary key references public.jugador (id) on delete cascade,
  nombre_federacion  text unique,
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------------
-- Lo que pasa en nuestros partidos (sale de las actas)
-- ---------------------------------------------------------------------------------------------

-- Un jugador figura en el acta de un partido, de inicio o como suplente.
create table public.participacion (
  partido_id  uuid not null references public.partido (id) on delete cascade,
  jugador_id  uuid not null references public.jugador (id) on delete cascade,
  titular     boolean not null default true,
  dorsal      integer check (dorsal between 1 and 99),  -- el que llevó ese día
  created_at  timestamptz not null default now(),
  primary key (partido_id, jugador_id)
);

-- Cada gol del partido con el marcador que dejó. Los rivales van sin autor.
create table public.gol (
  id                  uuid primary key default gen_random_uuid(),
  partido_id          uuid not null references public.partido (id) on delete cascade,
  equipo_id           uuid not null references public.equipo (id) on delete restrict,
  jugador_id          uuid references public.jugador (id) on delete set null,
  minuto              integer check (minuto between 0 and 130),
  marcador_local      integer not null check (marcador_local >= 0),
  marcador_visitante  integer not null check (marcador_visitante >= 0),
  created_at          timestamptz not null default now(),
  unique (partido_id, marcador_local, marcador_visitante)
);

-- Tarjetas de nuestros jugadores.
create table public.tarjeta (
  id          uuid primary key default gen_random_uuid(),
  partido_id  uuid not null references public.partido (id) on delete cascade,
  jugador_id  uuid not null references public.jugador (id) on delete cascade,
  tipo        public.tipo_tarjeta not null,
  minuto      integer check (minuto between 0 and 130),
  created_at  timestamptz not null default now(),
  unique nulls not distinct (partido_id, jugador_id, tipo, minuto)
);

-- ---------------------------------------------------------------------------------------------
-- Convocatorias (las publica un gestor)
-- ---------------------------------------------------------------------------------------------

create table public.convocatoria (
  partido_id  uuid not null references public.partido (id) on delete cascade,
  jugador_id  uuid not null references public.jugador (id) on delete cascade,
  estado      public.estado_convocatoria not null default 'convocado',
  nota        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (partido_id, jugador_id)
);

-- ---------------------------------------------------------------------------------------------
-- Operación
-- ---------------------------------------------------------------------------------------------

-- Cada ejecución del scraper, para ver desde gestión si la última fue bien.
create table public.ejecucion_scraper (
  id       uuid primary key default gen_random_uuid(),
  inicio   timestamptz not null default now(),
  fin      timestamptz,
  estado   public.estado_ejecucion,
  resumen  jsonb,
  error    text,
  check (fin is null or fin >= inicio),
  check ((estado is null) = (fin is null))
);

-- ---------------------------------------------------------------------------------------------
-- Reglas del dominio que la base de datos aplica sola
-- ---------------------------------------------------------------------------------------------

-- Un gol es de uno de los dos equipos del partido, y solo lleva autor si es nuestro.
create function public.validar_gol()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  partido record;
begin
  select local_id, visitante_id into partido from public.partido where id = new.partido_id;
  if new.equipo_id not in (partido.local_id, partido.visitante_id) then
    raise exception 'El equipo del gol no juega ese partido';
  end if;
  if new.jugador_id is not null
     and not exists (select 1 from public.equipo where id = new.equipo_id and es_nuestro) then
    raise exception 'Solo los goles de nuestro equipo llevan autor';
  end if;
  return new;
end;
$$;

create trigger validar_gol
  before insert or update on public.gol
  for each row execute function public.validar_gol();

-- Participaciones, tarjetas y convocatorias solo tienen sentido en partidos nuestros.
create function public.exigir_partido_nuestro()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.partido p
    join public.equipo e on e.id in (p.local_id, p.visitante_id)
    where p.id = new.partido_id and e.es_nuestro
  ) then
    raise exception 'Ese partido no es de nuestro equipo';
  end if;
  return new;
end;
$$;

create trigger exigir_partido_nuestro
  before insert or update on public.participacion
  for each row execute function public.exigir_partido_nuestro();

create trigger exigir_partido_nuestro
  before insert or update on public.tarjeta
  for each row execute function public.exigir_partido_nuestro();

create trigger exigir_partido_nuestro
  before insert or update on public.convocatoria
  for each row execute function public.exigir_partido_nuestro();

-- `updated_at` automático.
create trigger set_updated_at before update on public.competicion
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.equipo
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jornada
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.partido
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jugador
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jugador_privado
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.convocatoria
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Vistas para las pantallas
-- ---------------------------------------------------------------------------------------------

-- Estadísticas de cada jugador a partir de las actas. `goles_encajados` solo tiene sentido
-- para porteros: goles del rival en los partidos en que jugó.
create view public.estadisticas_jugador
with (security_invoker = true)
as
select
  j.id as jugador_id,
  j.nombre_mostrar,
  j.dorsal,
  j.posicion,
  j.activo,
  count(p.partido_id)::integer as partidos,
  count(p.partido_id) filter (where p.titular)::integer as titularidades,
  coalesce(g.goles, 0)::integer as goles,
  coalesce(t.amarillas, 0)::integer as amarillas,
  coalesce(t.rojas, 0)::integer as rojas,
  coalesce(e.goles_encajados, 0)::integer as goles_encajados
from public.jugador j
left join public.participacion p on p.jugador_id = j.id
left join lateral (
  select count(*) as goles from public.gol where jugador_id = j.id
) g on true
left join lateral (
  select
    count(*) filter (where tipo = 'amarilla') as amarillas,
    count(*) filter (where tipo = 'roja') as rojas
  from public.tarjeta where jugador_id = j.id
) t on true
left join lateral (
  select count(*) as goles_encajados
  from public.gol gol
  join public.participacion pa on pa.partido_id = gol.partido_id and pa.jugador_id = j.id
  join public.equipo eq on eq.id = gol.equipo_id
  where not eq.es_nuestro
) e on true
group by j.id, g.goles, t.amarillas, t.rojas, e.goles_encajados;

-- ---------------------------------------------------------------------------------------------
-- Permisos. El proyecto no expone tablas automáticamente: cada una declara su acceso.
-- El scraper escribe con la clave de servicio, que no pasa por RLS.
-- ---------------------------------------------------------------------------------------------

-- `es_gestor()` también la llaman las políticas que evalúa un visitante: para él devuelve false.
grant execute on function public.es_gestor() to anon;

-- Lectura pública.
grant select on
  public.competicion, public.equipo, public.jornada, public.partido, public.clasificacion,
  public.jugador, public.participacion, public.gol, public.tarjeta, public.convocatoria,
  public.estadisticas_jugador
to anon, authenticated;

-- Lo que escriben los gestores.
grant insert, update, delete on public.jugador, public.jugador_privado, public.convocatoria
  to authenticated;
grant select on public.jugador_privado, public.ejecucion_scraper to authenticated;
grant update on public.partido to authenticated;

alter table public.competicion enable row level security;
alter table public.equipo enable row level security;
alter table public.jornada enable row level security;
alter table public.partido enable row level security;
alter table public.clasificacion enable row level security;
alter table public.jugador enable row level security;
alter table public.jugador_privado enable row level security;
alter table public.participacion enable row level security;
alter table public.gol enable row level security;
alter table public.tarjeta enable row level security;
alter table public.convocatoria enable row level security;
alter table public.ejecucion_scraper enable row level security;

create policy "lectura publica" on public.competicion for select to anon, authenticated using (true);
create policy "lectura publica" on public.equipo for select to anon, authenticated using (true);
create policy "lectura publica" on public.jornada for select to anon, authenticated using (true);
create policy "lectura publica" on public.partido for select to anon, authenticated using (true);
create policy "lectura publica" on public.clasificacion for select to anon, authenticated using (true);
create policy "lectura publica" on public.jugador for select to anon, authenticated using (true);
create policy "lectura publica" on public.participacion for select to anon, authenticated using (true);
create policy "lectura publica" on public.gol for select to anon, authenticated using (true);
create policy "lectura publica" on public.tarjeta for select to anon, authenticated using (true);

-- La convocatoria se ve cuando el gestor la publica; antes, solo los gestores.
create policy "lectura si esta publicada"
  on public.convocatoria
  for select
  to anon, authenticated
  using (
    public.es_gestor()
    or exists (
      select 1 from public.partido p where p.id = partido_id and p.convocatoria_publicada
    )
  );

create policy "gestores escriben" on public.jugador
  for all to authenticated using (public.es_gestor()) with check (public.es_gestor());
create policy "gestores leen y escriben" on public.jugador_privado
  for all to authenticated using (public.es_gestor()) with check (public.es_gestor());
create policy "gestores escriben" on public.convocatoria
  for all to authenticated using (public.es_gestor()) with check (public.es_gestor());
create policy "gestores corrigen" on public.partido
  for update to authenticated using (public.es_gestor()) with check (public.es_gestor());
create policy "gestores leen" on public.ejecucion_scraper
  for select to authenticated using (public.es_gestor());
