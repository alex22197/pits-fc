# 0003. Los datos de la liga se importan de la intranet con un scraper

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

La liga Ayto. Alcobendas Fútbol 7 no tiene web pública: calendario, resultados,
clasificación, goleadores y actas solo están en la intranet de la federación, con el usuario
del club. Se comprobó que la web pública de la RFFM no cubre las competiciones locales de
Alcobendas. La intranet es HTML sencillo generado en el servidor, con un formulario de login
sin captcha.

Las alternativas eran meterlo todo a mano cada semana o pegar las tablas copiadas de la
intranet. Ambas pierden las actas, que dan las estadísticas por jugador gratis.

## Decisión

- Una Edge Function de Supabase entra en la intranet con las credenciales del club, lee las
  páginas y guarda los datos. Se programa cada semana y se puede lanzar a mano.
- Las credenciales viven solo como secretos de Supabase, creados por Alex desde su terminal.
  No se escriben en el repositorio ni se pasan por chat a nadie, asistentes incluidos.
- Si la intranet cambia o deja de responder, la web sigue con los últimos datos y los
  gestores pueden corregir a mano.

## Consecuencias

- El proyecto depende de que la intranet mantenga su formato; `docs/scraper.md` documenta
  lo que se espera para poder arreglarlo rápido.
- Las credenciales dan acceso a más cosas que a las consultas: el código solo lee, nunca
  envía formularios de la intranet, y no registra nada sensible en los logs.
- Los minutos por jugador no existen (las actas no traen sustituciones).
