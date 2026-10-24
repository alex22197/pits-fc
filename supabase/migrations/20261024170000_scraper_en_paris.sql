-- La intranet de la federación rechaza las conexiones desde las regiones de Supabase en
-- Irlanda y Fráncfort, pero acepta las de París (eu-west-3). Supabase elige la región de la
-- función por petición, y se puede fijar con la cabecera `x-region`.
-- requiere: pg_cron, pg_net (extensiones de Supabase; la prueba local las omite)

select cron.unschedule('importar-federacion');

select cron.schedule(
  'importar-federacion',
  '0 8 * * 2',
  $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'url_importar_federacion'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-region', 'eu-west-3',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'clave_servicio')
      ),
      body := jsonb_build_object('origen', 'cron'),
      timeout_milliseconds := 120000
    );
  $$
);
