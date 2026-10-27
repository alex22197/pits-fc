-- La convocatoria pasa a ser una alineación (#33): los siete titulares llevan su puesto en el
-- 1-2-3-1 de fútbol 7; los demás convocados son el banquillo. Un puesto solo puede tenerlo un
-- convocado, y uno por partido.

create type public.puesto_alineacion as enum (
  'portero',
  'central_izquierdo',
  'central_derecho',
  'lateral_izquierdo',
  'medio',
  'lateral_derecho',
  'delantero'
);

alter table public.convocatoria
  add column puesto public.puesto_alineacion,
  add constraint convocatoria_puesto_solo_convocado check (puesto is null or estado = 'convocado');

create unique index convocatoria_puesto_unico
  on public.convocatoria (partido_id, puesto)
  where puesto is not null;

comment on column public.convocatoria.puesto is
  'Puesto del titular en el 1-2-3-1; null si es del banquillo, duda o descartado.';
