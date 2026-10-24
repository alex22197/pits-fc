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
- [x] Activar el login con Google en Supabase y crear la aplicación OAuth en Google Cloud
      (24-10-2026).
- [x] Entrar una vez con Google y asignarse el rol `admin` en la tabla `perfil` (24-10-2026).
- [x] Credenciales de la intranet como secretos de la función, secretos del Vault y
      despliegue (24-10-2026).
- [x] Escudo en `web/public/imagenes/` con favicon e icono de móvil; en cabecera y portada
      (24-10-2026).
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

- [x] Edge Function `importar-federacion`: login, lectura de calendario, jornadas,
      clasificación y actas nuevas, y guardado en la base de datos, con tests de los
      analizadores (#5).
- [x] Programación semanal con `pg_cron` (migración `programar_scraper`) (#5).
- [x] Secretos de la función y del Vault, despliegue y primera importación con éxito:
      clasificación, fechas, horas y dos actas (24-10-2026).
- [ ] Botón «Actualizar ahora» y registro de ejecuciones visible en gestión.

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

- [x] Del equipo: fichas de posición, partidos, goles y diferencia; racha; casa y fuera;
      puntos acumulados y goles por jornada (gráficas con Apache ECharts) (#6).
- [x] Por jugador: goleadores, partidos (titular y suplente) y tarjetas; minuto de los goles
      del equipo (#6).
- [ ] Goles encajados por portero y ficha de cada jugador en «Plantilla».
- [ ] Más ideas: racha de partidos sin perder, media de goles por partido, mejor jornada,
      comparativa con el rival del próximo partido.

## Mejoras para después

- Disponibilidad de los jugadores en la web, entrenamientos, cuotas y multas.
- Torneo de la Hispanidad u otras competiciones.
- Base de datos de desarrollo separada de producción.
