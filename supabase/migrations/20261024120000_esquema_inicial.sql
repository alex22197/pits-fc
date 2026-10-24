-- Esquema inicial: solo lo que necesita la web para arrancar con login de gestores.
-- El modelo de datos del equipo (competición, partidos, jugadores, convocatorias…) llega en la
-- siguiente migración, una vez revisado docs/base-de-datos.md.

-- Roles de gestión. Los visitantes no tienen fila en `perfil`.
create type public.rol_usuario as enum ('admin', 'gestor');

-- Quién puede gestionar la web. Tener cuenta de Google no da permisos: el administrador
-- asigna el rol desde el panel de Supabase (ADR 0002).
create table public.perfil (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  rol         public.rol_usuario not null,
  created_at  timestamptz not null default now()
);

comment on table public.perfil is 'Rol de gestión de cada cuenta. Sin fila = visitante.';

-- El proyecto no expone tablas automáticamente: cada una declara su acceso.
alter table public.perfil enable row level security;

grant select on public.perfil to authenticated;

-- Cada cuenta solo lee su propio perfil: sirve para saber si es gestor.
create policy "cada cuenta lee su perfil"
  on public.perfil
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Nadie escribe en `perfil` desde la web: solo el panel de Supabase o una migración.

-- Función de ayuda para las políticas de las tablas del equipo: ¿la cuenta actual es gestora?
create function public.es_gestor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.perfil
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.es_gestor() from public;
grant execute on function public.es_gestor() to authenticated;
