# Base de datos

PostgreSQL en Supabase. Esquema `public`, nombres en castellano y `snake_case`. Todo cambio
es una migración en `supabase/migrations/`.

## Probar las migraciones sin Docker

```bash
npm run db:probar
```

Ejecuta todas las migraciones en un PostgreSQL embebido (PGlite) con un esquema `auth` y unos
roles de mentira, y comprueba los datos iniciales, las reglas de los triggers y los permisos
de un visitante (`supabase/tests/probar-migraciones.mjs`). La integración continua lo
ejecuta en cada cambio. No sustituye a probar en Supabase, pero pilla casi todo. Al añadir
una regla o una tabla, se añade su comprobación ahí.

## Migraciones

| Migración               | Qué trae                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `esquema_inicial`       | enum `rol_usuario`, tabla `perfil` y función `es_gestor()`.                                                               |
| `modelo_de_datos`       | Todo el modelo de abajo, con triggers, vista y permisos.                                                                  |
| `datos_iniciales`       | Competición 2026-2027, 13 equipos, 26 jornadas, 156 partidos y resultados conocidos al 23-10-2026; función `id_equipo()`. |
| `programar_scraper`     | `pg_cron` + `pg_net`: llamada semanal a la función del scraper (solo sintaxis en local).                                  |
| `permisos_service_role` | Permisos del rol de servicio sobre todo el esquema, presentes y futuros.                                                  |
| `scraper_en_paris`      | El cron fija la región `eu-west-3`, la única desde la que la intranet acepta conexiones.                                  |
| `ultima_importacion`    | Función pública con el fin de la última importación correcta, para el aviso del pie (#31).                                |
| `puesto_alineacion`     | Enum con los siete puestos del 1-2-3-1 y columna `convocatoria.puesto` con sus reglas (#33).                              |

## Modelo

Pensado para fútbol 7 y para lo que trae la intranet de la federación. Las claves de la
federación (`cod_*`) permiten al scraper reconocer cada cosa sin depender de los nombres.

```
competicion ──< jornada ──< partido >── equipo (local, visitante)
     │            │            │
     │            └─ descansa  ├──< participacion >── jugador ──── jugador_privado
     └──< clasificacion        ├──< gol                 │
            (por equipo)       ├──< tarjeta             └──< convocatoria
                               └──< convocatoria

perfil      ejecucion_scraper      vista estadisticas_jugador
```

### Competición y calendario

- **competicion**: `id`, `nombre`, `temporada`, `grupo`, `cod_competicion`, `cod_grupo`,
  `cod_temporada`, `activa`. Una fila por liga y temporada («Ayto. Alcobendas Fútbol 7»,
  «2026-2027», «2ª Aficionados G2»).
- **equipo**: `id`, `nombre`, `nombre_federacion`, `cod_equipo`, `es_nuestro`. Los nombres
  de la federación son los que salen en las tablas; `nombre` es la versión limpia que se
  muestra. Solo un equipo puede ser el nuestro (índice único).
- **jornada**: `id`, `competicion_id`, `numero`, `vuelta` (1 o 2), `fecha_prevista`,
  `descansa_id` (el equipo que no juega esa jornada).
- **partido**: `id`, `jornada_id`, `local_id`, `visitante_id`, `fecha_hora`, `campo`,
  `estado` (`programado`, `jugado`, `aplazado`, `suspendido`), `goles_local`,
  `goles_visitante`, `cod_acta`, `acta_importada_en`, `convocatoria_publicada`. El marcador
  existe si y solo si el estado es `jugado`. Un equipo juega una vez por jornada.
- **clasificacion**: `competicion_id`, `equipo_id`, `posicion`, `puntos`, `jugados`,
  `ganados`, `empatados`, `perdidos`, `goles_favor`, `goles_contra`, `sancion`, `ultimos`
  (texto como «G E P»), `actualizado_en`. Se sobrescribe en cada importación; no se calcula,
  porque las sanciones solo las sabe la federación. La posición es única por competición
  (restricción diferida, para reordenar en una transacción).

### Jugadores y lo que pasa en el partido

- **jugador**: `id`, `nombre_mostrar`, `dorsal`, `posicion` (`portero`, `defensa`,
  `centrocampista`, `delantero`), `activo`. Solo nuestros jugadores. Es lo que ve el público.
  El dorsal es único entre los activos.
- **jugador_privado**: `jugador_id`, `nombre_federacion`. El nombre tal como aparece en las
  actas, para que el scraper sepa quién es quién. Solo lo leen los gestores.
- **participacion**: `partido_id`, `jugador_id`, `titular`, `dorsal` (el de ese día). Una
  fila por jugador que figura en el acta de nuestro partido.
- **gol**: `id`, `partido_id`, `equipo_id`, `jugador_id` (`null` si es rival), `minuto`,
  `marcador_local`, `marcador_visitante`. Los goles rivales se guardan sin autor (ADR 0004).
- **tarjeta**: `id`, `partido_id`, `jugador_id`, `tipo` (`amarilla`, `roja`), `minuto`.
  Solo las nuestras.
- **convocatoria**: `partido_id`, `jugador_id`, `estado` (`convocado`, `duda`,
  `descartado`), `puesto` (enum `puesto_alineacion`: los siete del 1-2-3-1; solo un convocado
  por puesto y partido, y solo si está convocado) y `nota`. Convocado con puesto es titular;
  sin puesto, banquillo. La publica un gestor marcando `partido.convocatoria_publicada`.

### Operación

- **ejecucion_scraper**: `id`, `inicio`, `fin`, `estado` (`ok`, `error`), `resumen` (jsonb
  con cuántas jornadas, partidos y actas se actualizaron), `error`. Para ver desde gestión
  si la última importación fue bien.

### Vista `estadisticas_jugador`

Por jugador: `partidos`, `titularidades`, `goles`, `amarillas`, `rojas` y `goles_encajados`
(goles del rival en los partidos en que jugó; solo tiene sentido para porteros). Con
`security_invoker`, así que respeta los permisos de quien consulta.

### Funciones

- `es_gestor()`: si la cuenta actual tiene fila en `perfil`. La usan las políticas.
- `id_equipo(nombre_en_federacion)`: id de un equipo por su nombre en la intranet. La usan
  las migraciones de datos y el scraper.
- `ultima_importacion()`: fin de la última importación correcta, o `null`. La puede llamar
  cualquiera (la usa el pie de la web); no da acceso al registro `ejecucion_scraper`.
- `set_updated_at()`, `validar_gol()` y `exigir_partido_nuestro()`: triggers de abajo.

### Reglas que aplica la base de datos

- Un partido no puede tener el mismo equipo de local y de visitante, y un equipo juega una
  vez por jornada.
- Marcador si y solo si `estado = 'jugado'`.
- Un gol es de uno de los dos equipos del partido y solo lleva autor si es nuestro
  (trigger `validar_gol`).
- Participaciones, tarjetas y convocatorias solo en partidos nuestros (trigger
  `exigir_partido_nuestro`).
- Los goles de un partido deben cuadrar con el marcador: se comprueba al importar, no con
  restricción, porque la federación puede corregir actas.
- `dorsal` único entre jugadores activos; una convocatoria por jugador y partido.

### Permisos (RLS)

| Tabla                                      | Visitante             | Gestor        | Scraper (service role) |
| ------------------------------------------ | --------------------- | ------------- | ---------------------- |
| competicion, equipo, jornada               | lee                   | lee           | escribe                |
| partido                                    | lee                   | lee y corrige | escribe                |
| clasificacion, gol, tarjeta, participacion | lee                   | lee           | escribe                |
| jugador                                    | lee                   | lee y escribe | lee                    |
| jugador_privado                            | —                     | lee y escribe | lee                    |
| convocatoria                               | lee si está publicada | lee y escribe | —                      |
| estadisticas_jugador (vista)               | lee                   | lee           | —                      |
| ejecucion_scraper                          | —                     | lee           | escribe                |
| perfil                                     | —                     | lee el suyo   | —                      |

## Convenciones

- Cada tabla con `id uuid default gen_random_uuid()`, `created_at` y `updated_at` (trigger
  `set_updated_at`) salvo las de clave compuesta.
- RLS activado en todas, políticas explícitas y `grant` solo de lo necesario.
- Las reglas del dominio van en restricciones y triggers, no solo en la web.
- Tras cada migración aplicada: `npm run db:tipos`.
