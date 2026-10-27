-- Los goles, las asistencias y las tarjetas de nuestros partidos los apuntan los gestores
-- después de cada partido (#34). El scraper deja de traerlos del acta.

-- Asistente del gol: solo en goles nuestros y distinto del goleador.
alter table public.gol
  add column asistente_id uuid references public.jugador (id) on delete set null,
  add constraint gol_asistente_distinto check (asistente_id is null or asistente_id <> jugador_id);

create or replace function public.validar_gol()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  partido record;
  nuestro boolean;
begin
  select local_id, visitante_id into partido from public.partido where id = new.partido_id;
  if new.equipo_id not in (partido.local_id, partido.visitante_id) then
    raise exception 'El equipo del gol no juega ese partido';
  end if;
  select es_nuestro into nuestro from public.equipo where id = new.equipo_id;
  if new.jugador_id is not null and not nuestro then
    raise exception 'Solo los goles de nuestro equipo llevan autor';
  end if;
  if new.asistente_id is not null and not nuestro then
    raise exception 'Solo los goles de nuestro equipo llevan asistente';
  end if;
  return new;
end;
$$;

-- La vista suma las asistencias (columna nueva al final, como exige `create or replace`).
create or replace view public.estadisticas_jugador
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
  coalesce(e.goles_encajados, 0)::integer as goles_encajados,
  coalesce(a.asistencias, 0)::integer as asistencias
from public.jugador j
left join public.participacion p on p.jugador_id = j.id
left join lateral (
  select count(*) as goles from public.gol where jugador_id = j.id
) g on true
left join lateral (
  select count(*) as asistencias from public.gol where asistente_id = j.id
) a on true
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
group by j.id, g.goles, a.asistencias, t.amarillas, t.rojas, e.goles_encajados;

-- Los gestores escriben goles y tarjetas, pero solo de nuestros partidos.
create function public.es_partido_nuestro(id_partido uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.partido p
    join public.equipo e on e.id in (p.local_id, p.visitante_id)
    where p.id = id_partido and e.es_nuestro
  );
$$;

grant execute on function public.es_partido_nuestro(uuid) to authenticated;
grant insert, update, delete on public.gol, public.tarjeta to authenticated;

create policy "gestores escriben" on public.gol
  for all to authenticated
  using (public.es_gestor() and public.es_partido_nuestro(partido_id))
  with check (public.es_gestor() and public.es_partido_nuestro(partido_id));

create policy "gestores escriben" on public.tarjeta
  for all to authenticated
  using (public.es_gestor())
  with check (public.es_gestor());
