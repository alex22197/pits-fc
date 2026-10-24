# Hoja de ruta

Qué está hecho y qué toca ahora. Cada tarea pendiente tendrá su issue en GitHub; al
terminarla, se marca aquí.

## Hecho

- [x] Proyecto inicializado: Angular 22 en `web/`, Supabase en `supabase/`, ESLint, Prettier,
      Vitest, Husky, integración continua y documentación (24-10-2026).
- [x] Esqueleto de la web: cabecera, navegación, portada, páginas de las secciones (en
      construcción), acceso con Google y página no encontrada.
- [x] Primera migración: roles y tabla `perfil` con RLS.
- [x] Análisis de la intranet de la federación ([`scraper.md`](scraper.md)).

## 1. Configuración pendiente (Alex, desde los paneles)

- [x] Crear el proyecto de Supabase «pits-fc» y pasar la URL y la publishable key a
      `web/src/environments/` y a `web/public/_headers` (24-10-2026).
- [x] Enlazar el repositorio con el proyecto (`npx supabase link`) y aplicar las migraciones
      (`npm run db:migrar`); después `npm run db:tipos` (24-10-2026).
- [ ] Activar el login con Google en Supabase y crear la aplicación OAuth en Google Cloud.
- [ ] Entrar una vez con Google y asignarse el rol `admin` en la tabla `perfil`.
- [ ] Guardar las credenciales de la intranet como secretos de Supabase (`supabase secrets
      set FEDERACION_USUARIO=… FEDERACION_CLAVE=…`), tecleadas en el terminal, nunca en
      ficheros.
- [ ] Dejar el escudo en `web/public/imagenes/escudo-pits-fc.png` (y un favicon a partir
      de él) para que la cabecera y la pestaña lo usen.
- [ ] Crear el proyecto en Cloudflare Pages apuntando a `main` (ver
      [`despliegue.md`](despliegue.md)).
- [ ] Decidir el nombre corto que se muestra de cada jugador.

## 2. Modelo de datos

- [x] Migración del modelo: competición, equipos, jornadas, partidos, clasificación,
      jugadores, participaciones, goles, tarjetas, convocatorias y registro del scraper, con
      RLS, triggers y vista de estadísticas (#3).
- [x] Datos iniciales: competición 2026-2027, 13 equipos, 26 jornadas y 156 partidos (#3).
- [x] `npm run db:probar`: las migraciones se ejecutan y comprueban en un PostgreSQL embebido,
      también en la integración continua (#3).
- [x] Servicios de `data-access/` con mapeadores, fixtures, funciones puras (próximo
      partido, resultado) y tests (#4).

## 3. Scraper de la federación

- [ ] Edge Function `importar-federacion`: login, lectura de calendario, clasificación,
      goleadores y actas nuevas, y guardado en la base de datos.
- [ ] Programación semanal con `pg_cron` y botón «Actualizar ahora» en gestión.
- [ ] Registro de cada ejecución (`ejecucion_scraper`) visible para los gestores.

## 4. Pantallas públicas

- [ ] Portada: próximo partido, convocatoria publicada, último resultado y resumen de la
      clasificación.
- [ ] Calendario: jornadas con fecha, hora, campo y marcador; detalle de nuestro partido con
      goles y tarjetas.
- [ ] Clasificación: tabla del grupo con nuestra fila destacada.
- [ ] Plantilla: jugadores con dorsal y posición; ficha con sus estadísticas.

## 5. Gestión

- [ ] Convocatoria de un partido: elegir jugadores y publicarla; texto para WhatsApp.
- [ ] Jugadores: nombre corto, dorsal, posición y correspondencia con el nombre de las actas.
- [ ] Invitar gestores por correo.

## 6. Estadísticas

- [ ] Por jugador: partidos, titularidades, goles, tarjetas; goles encajados para porteros.
- [ ] Del equipo por jornada, con gráficas (Apache ECharts).

## Mejoras para después

- Disponibilidad de los jugadores en la web, entrenamientos, cuotas y multas.
- Torneo de la Hispanidad u otras competiciones.
- Base de datos de desarrollo separada de producción.
