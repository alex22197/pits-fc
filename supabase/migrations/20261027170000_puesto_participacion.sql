-- Los titulares del acta también se colocan en el 1-2-3-1 (#36): la pizarra de «Quién jugó».
-- El scraper copia el puesto de la alineación publicada; los gestores lo corrigen.

alter table public.participacion
  add column puesto public.puesto_alineacion,
  add constraint participacion_puesto_solo_titular check (puesto is null or titular);

create unique index participacion_puesto_unico
  on public.participacion (partido_id, puesto)
  where puesto is not null;

comment on column public.participacion.puesto is
  'Puesto del titular en el 1-2-3-1 según los gestores; null si no se ha colocado o es suplente.';

grant update on public.participacion to authenticated;

create policy "gestores colocan" on public.participacion
  for update to authenticated using (public.es_gestor()) with check (public.es_gestor());
