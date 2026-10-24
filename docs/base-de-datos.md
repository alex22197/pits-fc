# Base de datos

PostgreSQL en Supabase. Esquema `public`, nombres en castellano y `snake_case`. Todo cambio
es una migración en `supabase/migrations/`.

## Lo que ya existe (migración `esquema_inicial`)

| Objeto            | Para qué                                                         |
| ----------------- | ---------------------------------------------------------------- |
| enum `rol_usuario` | `admin` (Alex) y `gestor` (quien publica convocatorias).        |
| tabla `perfil`    | Rol de cada cuenta. Sin fila = visitante. Solo se lee el propio. |
| función `es_gestor()` | Para las políticas RLS de las tablas del equipo.             |

## Modelo propuesto (pendiente de revisar y migrar)

Pensado para fútbol 7 y para lo que trae la intranet de la federación. Las claves de la
federación (`cod_*`) permiten al scraper reconocer cada cosa sin depender de los nombres.

```
competicion ──< jornada ──< partido >── equipo (local, visitante)
     │                         │
     └──< clasificacion        ├──< participacion >── jugador ──── jugador_privado
            (por equipo)       ├──< gol                 │
                               ├──< tarjeta             └──< convocatoria
                               └──< convocatoria

perfil      ejecucion_scraper
```

### Competición y calendario

- **competicion**: `id`, `nombre`, `temporada`, `grupo`, `cod_competicion`, `cod_grupo`,
  `cod_temporada`, `activa`. Una fila por liga y temporada («Ayto. Alcobendas Fútbol 7»,
  «2026-2027», «2ª Aficionados G2»).
- **equipo**: `id`, `nombre`, `nombre_federacion`, `cod_equipo`, `es_nuestro`. Los nombres
  de la federación son los que salen en las tablas; `nombre` puede ser una versión limpia.
- **jornada**: `id`, `competicion_id`, `numero`, `fecha_prevista`, `vuelta` (1 o 2).
- **partido**: `id`, `jornada_id`, `local_id`, `visitante_id` (`null` cuando descansa),
  `fecha_hora`, `campo`, `goles_local`, `goles_visitante`, `estado` (`programado`, `jugado`,
  `aplazado`, `suspendido`), `cod_acta`, `convocatoria_publicada`.
- **clasificacion**: `competicion_id`, `equipo_id`, `posicion`, `puntos`, `jugados`,
  `ganados`, `empatados`, `perdidos`, `goles_favor`, `goles_contra`, `sancion`, `ultimos`
  (texto como «G E P»), `actualizado_en`. Se sobrescribe en cada importación; no se calcula,
  porque las sanciones solo las sabe la federación.

### Jugadores y lo que pasa en el partido

- **jugador**: `id`, `nombre_mostrar`, `dorsal`, `posicion` (`portero`, `defensa`,
  `centrocampista`, `delantero`), `activo`. Solo nuestros jugadores. Es lo que ve el público.
- **jugador_privado**: `jugador_id`, `nombre_federacion`. El nombre tal como aparece en las
  actas, para que el scraper sepa quién es quién. Solo lo leen los gestores.
- **participacion**: `partido_id`, `jugador_id`, `titular`. Una fila por jugador que figura
  en el acta de nuestro partido.
- **gol**: `id`, `partido_id`, `equipo_id`, `jugador_id` (`null` si es rival), `minuto`,
  `marcador_local`, `marcador_visitante`. Los goles rivales se guardan sin autor (ADR 0004).
- **tarjeta**: `id`, `partido_id`, `jugador_id`, `tipo` (`amarilla`, `roja`), `minuto`.
  Solo las nuestras.
- **convocatoria**: `partido_id`, `jugador_id`, `estado` (`convocado`, `duda`,
  `descartado`), `nota`. La publica un gestor.

### Operación

- **ejecucion_scraper**: `id`, `inicio`, `fin`, `estado` (`ok`, `error`), `resumen` (jsonb
  con cuántas jornadas, partidos y actas se actualizaron), `error`. Para ver desde gestión
  si la última importación fue bien.

### Reglas que aplica la base de datos

- Un partido no puede tener el mismo equipo de local y de visitante.
- Marcador solo cuando `estado = 'jugado'`; goles por partido coherentes con el marcador
  (se comprueba al importar, no con restricción, porque la federación puede corregir actas).
- `dorsal` único entre jugadores activos.
- Una convocatoria por jugador y partido.

### Permisos (RLS)

| Tabla                                   | Visitante | Gestor                | Scraper (service role) |
| --------------------------------------- | --------- | --------------------- | ---------------------- |
| competicion, equipo, jornada, partido   | lee       | lee                   | escribe                |
| clasificacion, gol, tarjeta, participacion | lee    | lee                   | escribe                |
| jugador                                 | lee       | lee y escribe         | lee                    |
| jugador_privado                         | —         | lee y escribe         | lee                    |
| convocatoria                            | lee       | lee y escribe         | —                      |
| ejecucion_scraper                       | —         | lee                   | escribe                |
| perfil                                  | —         | lee el suyo           | —                      |

Vistas previstas para las pantallas: `estadisticas_jugador` (partidos, titularidades, goles,
tarjetas por jugador) y `resumen_jornada`.

## Convenciones

- Cada tabla con `id uuid default gen_random_uuid()`, `created_at` y `updated_at` (trigger
  `set_updated_at`) salvo las de clave compuesta.
- RLS activado en todas, políticas explícitas y `grant` solo de lo necesario.
- Las reglas del dominio van en restricciones y triggers, no solo en la web.
- Tras cada migración aplicada: `npm run db:tipos`.
