# Scraper de la federación

Cómo se traen los datos de la liga desde la intranet de la delegación de Alcobendas de la
RFFM. Lo comprobado aquí es de octubre de 2026; si la intranet cambia, este documento se
actualiza primero.

## Por qué un scraper con credenciales

La liga no tiene web pública (ver [`contexto.md`](contexto.md)). La intranet
(`https://alcobendas.ffmadrid.es/nfg/`) pide usuario y clave del club para todo. La
alternativa era teclear cada semana calendario, marcadores, clasificación y goleadores, y
además perder las actas, que dan las estadísticas por jugador sin trabajo. Decisión en
ADR 0003.

## Credenciales

- Son el usuario y la clave del club en la federación. Dan acceso a licencias y gestión
  económica, así que se tratan como lo más sensible del proyecto.
- Viven **solo** como secretos de la Edge Function, creados por Alex desde su terminal:

  ```bash
  npx supabase secrets set FEDERACION_USUARIO=… FEDERACION_CLAVE=…
  ```

- No se escriben en ningún fichero del repositorio, ni en `.env`, ni en la documentación, ni
  se pasan por chat a ningún asistente. El código las lee por nombre de variable y no las
  registra nunca en logs.
- Si cambian, solo hay que repetir el comando.

## Cómo es la intranet

Aplicación Novanet con HTML generado en el servidor: tablas Bootstrap, sin JavaScript que
cargue datos. Codigos de nuestra competición (temporada 2026-2027):

| Parámetro               | Valor   |
| ----------------------- | ------- |
| `cod_primaria`          | 1000128 |
| `CodCompeticion`        | 339610  |
| `CodGrupo`              | 339627  |
| `CodTemporada`          | 22      |
| `Sch_Codigo_Delegacion` | 40032   |
| `Codigo_Equipo` (PITS)  | 326330  |

Páginas, todas bajo `/nfg/NPcd/`:

| Página        | URL                                                                              | Qué trae                                                                                   |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Login         | `POST /nfg/NLogin` con `NUser` y `NPass`                                         | Cookie de sesión `JSESSIONID`. Sin captcha.                                                |
| Calendario    | `NFG_VisCalendario_Vis?cod_primaria&codtemporada&codcompeticion&codgrupo`        | Las 26 jornadas con fecha y marcadores (vacíos si no se ha jugado).                        |
| Jornada       | `NFG_CmpJornada?cod_primaria&CodCompeticion&CodGrupo&CodTemporada&CodJornada=N`  | Partidos con fecha, hora, campo, marcador y enlace al acta (`CodActa`).                   |
| Clasificación | `NFG_VisClasificacion?cod_primaria&codjornada&codcompeticion&codgrupo`           | Puntos, J, G, E, P, F, C, últimos resultados y sanción. También versión casa/fuera.       |
| Goleadores    | `NFG_CMP_Goleadores?cod_primaria&CodJornada&codcompeticion&codtemporada&codgrupo` | Jugador, equipo, partidos y goles de todo el grupo.                                       |
| Acta          | `NFG_CmpPartido?cod_primaria&CodActa=X`                                          | Titulares con dorsal, suplentes, sustituciones, tarjetas con minuto, goles con minuto y autor, árbitro, campo. |
| Equipo        | `NFG_VisEquipos?cod_primaria=1000102&Codigo_Equipo=X`                            | Plantilla con tipo de licencia. Trae datos de contacto: solo se usa para nombres.          |

Las actas de esta liga no registran sustituciones, así que no hay minutos por jugador.

## Qué hace cada ejecución

1. Inicia sesión y guarda la cookie.
2. Descarga el calendario completo y actualiza fechas, campos y marcadores de todos los
   partidos del grupo.
3. Descarga la clasificación y la sobrescribe.
4. Descarga los goleadores (para contrastar nuestros goles).
5. Para cada partido nuestro ya jugado sin acta importada, descarga el acta y guarda
   participaciones, goles y tarjetas. Los jugadores se reconocen por
   `jugador_privado.nombre_federacion`; si uno no se reconoce, se registra en el resumen
   para que un gestor lo asocie.
6. Escribe una fila en `ejecucion_scraper` con el resumen o el error.

Si algo falla (la intranet no responde, una tabla cambia de forma), no se escribe nada de ese
paso, queda el error registrado y la web sigue con los últimos datos buenos.

## Dónde y cuándo corre

- Edge Function `importar-federacion` en `supabase/functions/`, escrita en TypeScript (Deno).
  Escribe en la base de datos con la clave de servicio, que también es un secreto.
- `pg_cron` + `pg_net` la llaman cada martes a las 9:00 (hora de Madrid), cuando los partidos
  del lunes ya están cerrados. Puede cambiarse a diario: es barato.
- Desde la zona de gestión, un botón «Actualizar ahora» la lanza a mano.

## Privacidad

- De las actas solo se guardan con nombre nuestros jugadores (y en la tabla privada). Los
  goles rivales se guardan sin autor; árbitros y rivales no se almacenan con nombre (ADR 0004).
- La página de equipo trae teléfono y correo del responsable del club: no se guarda nada de
  eso.
