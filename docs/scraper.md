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

| Página        | URL                                                                               | Qué trae                                                                                                       |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Login         | `POST /nfg/NLogin` con `NUser` y `NPass`                                          | Cookie de sesión `JSESSIONID`. Sin captcha.                                                                    |
| Calendario    | `NFG_VisCalendario_Vis?cod_primaria&codtemporada&codcompeticion&codgrupo`         | Las 26 jornadas con fecha y marcadores (vacíos si no se ha jugado).                                            |
| Jornada       | `NFG_CmpJornada?cod_primaria&CodCompeticion&CodGrupo&CodTemporada&CodJornada=N`   | Partidos con fecha, hora, campo, marcador y enlace al acta (`CodActa`).                                        |
| Clasificación | `NFG_VisClasificacion?cod_primaria&codjornada&codcompeticion&codgrupo`            | Puntos, J, G, E, P, F, C, últimos resultados y sanción. También versión casa/fuera.                            |
| Goleadores    | `NFG_CMP_Goleadores?cod_primaria&CodJornada&codcompeticion&codtemporada&codgrupo` | Jugador, equipo, partidos y goles de todo el grupo.                                                            |
| Acta          | `NFG_CmpPartido?cod_primaria&CodActa=X`                                           | Titulares con dorsal, suplentes, sustituciones, tarjetas con minuto, goles con minuto y autor, árbitro, campo. |
| Equipo        | `NFG_VisEquipos?cod_primaria=1000102&Codigo_Equipo=X`                             | Plantilla con tipo de licencia. Trae datos de contacto: solo se usa para nombres.                              |

Las actas de esta liga no registran sustituciones, así que no hay minutos por jugador.

## Qué hace cada ejecución

Código en `supabase/functions/importar-federacion/`:

```
index.ts            Entrada HTTP: autoriza al llamante y responde con el resumen
autorizacion.ts     Acepta la clave de servicio (cron) o la sesión de un gestor
importar.ts         Orquesta los pasos y registra la ejecución
intranet/           Cliente con sesión, URLs y un analizador por página (con tests)
guardado/           Un fichero por tabla que se escribe, más el nombre corto de jugadores
utils/fechas.ts     Fechas de la intranet y hora de Madrid con horario de verano
```

1. Abre una fila en `ejecucion_scraper` e inicia sesión en la intranet.
2. **Calendario**: lee las 26 jornadas y, para cada partido, el código de acta, el marcador y
   el estado. Crea los partidos que no existan y actualiza el equipo que descansa.
3. **Jornadas** de las tres semanas anteriores y las cuatro siguientes, más cualquiera con
   partidos pendientes: lee fecha, hora y campo de cada partido (lo único que el calendario
   no trae). Un partido sin resultado cuya fecha pasó hace más de dos días se marca
   **aplazado**; la intranet no lo dice, se deduce. Cuando la federación le pone fecha nueva,
   vuelve a `programado` (`guardado/estado-partido.ts`).
4. **Clasificación** de la última jornada cuya fecha ya ha pasado: borra la anterior y guarda
   la nueva. Los equipos se reconocen por su código de la federación.
5. **Actas** de nuestros partidos jugados que no se hayan importado, y también las de los
   últimos 14 días por si la federación las corrige: participaciones (titular o suplente y
   dorsal), goles (los rivales sin autor) y tarjetas nuestras.
6. Cierra la ejecución con estado, resumen (cuántos partidos, jornadas, filas y actas, avisos
   y jugadores nuevos) y el error si lo hubo.

Cada paso se intenta aunque el anterior falle; lo que falla queda anotado en `errores` y la
ejecución se marca como `error`. Si un paso falla, no se escribe nada de ese paso y la web
sigue con los últimos datos buenos.

### Jugadores que no existen

Si en un acta aparece uno de los nuestros cuyo nombre no está en
`jugador_privado.nombre_federacion`, el scraper lo da de alta con un **nombre corto**: su
primer nombre con mayúscula inicial («Álvaro»), y si ya lo usa otro, la inicial del apellido
(«Samuel G.») o el apellido entero. El nombre completo va a la tabla privada. Los nuevos salen
en el resumen para que Alex les ponga el nombre o apodo que prefiera desde gestión.

Los goleadores del grupo no se importan: su tabla solo sirve para contrastar y traería
nombres de rivales (ADR 0004).

### Tres cosas que se aprendieron al ponerlo en marcha

- **La intranet rechaza las conexiones desde las regiones de Supabase en Irlanda y
  Fráncfort** («Connection refused»), pero acepta las de París. Supabase elige la región de la
  función por petición y se fija con la cabecera `x-region: eu-west-3`; el cron ya la manda
  (migración `scraper_en_paris`). Si algún día París deja de funcionar, se prueba otra región
  cambiando esa cabecera.
- **El HTML viene en ISO-8859-1**, no en UTF-8: leerlo con `text()` destroza tildes y eñes
  («�lvaro») y el analizador de la clasificación no encuentra «Últimos». Se decodifica con la
  codificación que declara la respuesta (`intranet/codificacion.ts`).
- **El rol de servicio no tenía permisos**: el proyecto se creó sin exponer tablas
  automáticamente y las migraciones solo daban permisos a visitantes y gestores. La migración
  `permisos_service_role` se los da a todo lo que exista y a lo que se cree después.

## Dónde y cuándo corre

- Edge Function `importar-federacion`, escrita en TypeScript para Deno. Escribe en la base de
  datos con la clave de servicio, que Supabase inyecta a la función.
- `pg_cron` + `pg_net` la llaman cada martes a las 8:00 UTC (9:00 o 10:00 en Madrid), cuando
  los partidos del lunes ya están cerrados (migración `programar_scraper`). Puede cambiarse a
  diario: es barato. Si cambia, hay que cambiar también `PROGRAMACION_IMPORTACION`
  (`web/src/app/data-access/importacion/proxima-importacion.ts`), con la que el pie de la web
  avisa de la próxima importación.
- Desde la zona de gestión, el botón «Actualizar ahora» la lanza a mano con la sesión del
  gestor.
- El pie de todas las páginas dice cuándo acabó la última importación correcta y cuándo será
  la próxima (#31).
- Para probarla a mano desde el terminal, con la sesión de la CLI y la URL del proyecto:

  ```bash
  curl -X POST https://ozmhigfbexqgteiythfx.supabase.co/functions/v1/importar-federacion -H "x-region: eu-west-3" -H "Authorization: Bearer <clave de servicio>"
  ```

  La clave de servicio se copia del panel en el momento y no se guarda en ningún sitio. Sin
  salir de la base de datos, también se puede lanzar con el mismo `net.http_post` del cron
  desde el SQL Editor, que lee la clave del Vault.

## Puesta en marcha (Alex, una vez)

1. Secretos de la función, desde el terminal en la raíz del repositorio:

   ```bash
   npx supabase secrets set FEDERACION_USUARIO=… FEDERACION_CLAVE=…
   ```

2. Desplegar la función: `npm run funciones:desplegar`.
3. Para el cron, dos secretos en el Vault de Supabase (panel → SQL Editor):

   ```sql
   select vault.create_secret('https://ozmhigfbexqgteiythfx.supabase.co/functions/v1/importar-federacion', 'url_importar_federacion');
   select vault.create_secret('<clave de servicio>', 'clave_servicio');
   ```

4. Aplicar la migración `programar_scraper` (`npm run db:migrar`), que activa `pg_cron` y
   `pg_net` y programa la llamada semanal.

## Probar y mantener

- `npm run funciones:probar`: comprueba tipos, formato y los tests de los analizadores y de
  las fechas, con fixtures anonimizadas que copian la estructura real de cada página.
- Si la intranet cambia una página, el analizador correspondiente fallará con un error claro
  en el resumen; se actualiza el analizador y su fixture.

## Privacidad

- De las actas solo se guardan con nombre nuestros jugadores (y en la tabla privada). Los
  goles rivales se guardan sin autor; árbitros y rivales no se almacenan con nombre (ADR 0004).
- La página de equipo trae teléfono y correo del responsable del club: no se guarda nada de
  eso.
