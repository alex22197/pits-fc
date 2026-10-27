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
- [x] Primeras versiones (0.1.x) publicadas con un Worker de Cloudflare (27-10-2026) (#10).
- [ ] Crear el proyecto de Cloudflare Pages para servir la web en <https://pits-fc.pages.dev>
      y borrar el Worker `pits-fc` ([`despliegue.md`](despliegue.md)) (#10).
- [ ] Añadir `https://pits-fc.pages.dev` a las URL del login en Supabase (#10).
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
- [x] Botón «Actualizar ahora» y registro de ejecuciones visible en gestión (#8).
- [x] Aviso en el pie de cuándo se actualizaron los datos y cuándo será la próxima vez (#31).

## 4. Pantallas públicas

- [x] Portada: próximo partido, convocatoria publicada, último resultado y resumen de la
      clasificación (#7).
- [x] Calendario: jornadas con fecha, hora, campo y marcador, abierto por la jornada que
      toca y con filtro a nuestros partidos; detalle de nuestro partido con cronología de
      goles y tarjetas, alineación y convocatoria (#7).
- [x] Clasificación: tabla del grupo con nuestra fila destacada (#7).
- [x] Plantilla: jugadores con dorsal y posición; ficha con sus cifras y sus partidos (#7).
- [x] Página de privacidad con Alex como contacto, pie con enlace en todas las páginas,
      vista previa para WhatsApp y fuera de buscadores (#10).

## 5. Gestión

- [x] Convocatoria de un partido: elegir jugadores (convocado, duda, no va, con nota),
      guardar, publicar o retirar, y copiar el texto para WhatsApp (#8).
- [x] Alineación en la pizarra: titulares en el 1-2-3-1 sobre un campo de fútbol 7, banquillo,
      dudas y quién no va; la misma pizarra en portada y en el partido (#33).
- [x] Jugadores: nombre corto, dorsal, posición y si sigue en el equipo, viendo el nombre
      de las actas (#8).
- [ ] Invitar gestores por correo desde la web (#9); de momento el administrador da el rol
      desde el panel.
- [ ] Asociar a mano un jugador con otro nombre de las actas cuando la federación lo escriba
      distinto.

## 6. Estadísticas

- [x] Del equipo: fichas de posición, partidos, goles y diferencia; racha; casa y fuera;
      puntos acumulados y goles por jornada (gráficas con Apache ECharts) (#6).
- [x] Por jugador: goleadores, partidos (titular y suplente) y tarjetas; minuto de los goles
      del equipo (#6).
- [x] Ficha de cada jugador en «Plantilla», con goles encajados si es portero (#7).
- [ ] Montaña rusa de la liga: posición de cada equipo jornada a jornada (#17).
- [ ] Datos curiosos y récords del equipo (#19).

## 7. Una web viva: interactividad y animación

Ideas para que la web sea original y divertida, cada una con su issue. Primero la guía de
animación (#14), que fija cómo se anima en todo el proyecto.

Prioridad alta:

- [ ] Invitar gestores desde la web (#9).
- [ ] Publicar la web: Cloudflare Pages, dominio y privacidad (#10).
- [ ] Portada viva: cuenta atrás y cara a cara con el próximo rival (#11).
- [ ] Añadir los partidos al calendario del móvil, con suscripción (#12).
- [ ] Instalable como app en el móvil (PWA) (#13).

Prioridad media:

- [ ] Guía de animación: ADR, tokens de movimiento y transiciones entre páginas (#14).
- [ ] Revivir el partido: cronología animada del acta (#15).
- [ ] Cromos de jugadores que giran, con foto (#16).
- [ ] Montaña rusa de la liga (#17).
- [ ] Compartir el resultado como imagen para WhatsApp e Instagram (#18).
- [ ] Datos curiosos y récords del equipo (#19).
- [ ] Celebración al abrir la web tras una victoria (#20).

Prioridad baja (requieren decidirlo con el equipo o identidad para jugadores):

- [ ] Porra del equipo: predicciones y ranking (#21).
- [ ] Votación del jugador del partido (#22).
- [ ] Cómo llegar a los campos (#23).
- [ ] Avisos en el móvil cuando se publica la convocatoria (#24).

## Mejoras sin fecha

- Disponibilidad de los jugadores en la web, entrenamientos, cuotas y multas.
- Torneo de la Hispanidad u otras competiciones.
- Base de datos de desarrollo separada de producción.
