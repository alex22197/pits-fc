-- Cuándo se actualizaron por última vez los datos de la federación, para avisarlo en la web
-- (#31). El registro `ejecucion_scraper` sigue siendo solo de gestores: esta función da a
-- cualquiera el fin de la última importación correcta y nada más (ni resumen ni errores).

create function public.ultima_importacion()
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select max(fin) from public.ejecucion_scraper where estado = 'ok';
$$;

comment on function public.ultima_importacion() is
  'Fin de la última importación correcta de la federación; null si aún no ha habido ninguna.';

revoke execute on function public.ultima_importacion() from public;
grant execute on function public.ultima_importacion() to anon, authenticated;
