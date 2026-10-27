-- Programación semanal del scraper de la federación.
-- requiere: pg_cron, pg_net (extensiones de Supabase; la prueba local las omite)
--
-- La función `importar-federacion` se llama cada martes a las 8:00 UTC (9:00 o 10:00 en
-- Madrid), cuando los partidos del lunes ya están cerrados. La URL de la función y la clave
-- de servicio se leen del Vault de Supabase en cada ejecución; los crea Alex desde el editor
-- SQL (docs/scraper.md), nunca van en una migración.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'importar-federacion',
  '0 8 * * 2',
  $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'url_importar_federacion'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'clave_servicio')
      ),
      body := jsonb_build_object('origen', 'cron'),
      timeout_milliseconds := 120000
    );
  $$
);
