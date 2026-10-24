# Arquitectura

## Visión general

```
 Navegador ──► Cloudflare Pages (ficheros estáticos de Angular)
     │
     └──────► Supabase
                ├─ API REST generada sobre PostgreSQL (lecturas y escrituras)
                ├─ Auth (login con Google)
                ├─ PostgreSQL con RLS: decide qué puede leer o escribir cada uno
                └─ Edge Function «importar-federacion», lanzada por pg_cron cada semana
                        │
                        └──► intranet de la federación (alcobendas.ffmadrid.es)
```

No hay servidor propio. La web es una aplicación de una sola página que habla directamente
con Supabase usando la _publishable key_, que es pública. La seguridad está en la base de
datos: las políticas RLS impiden que un visitante lea datos privados o escriba nada.

El scraper vive dentro de Supabase como función. Las credenciales de la intranet son secretos
de la función; nunca pasan por el repositorio ni por la web ([`scraper.md`](scraper.md)).

## Carpetas de `web/src/app`

```
core/
  config/           Token de entorno y constantes del sitio
  supabase/         Cliente único de Supabase, errores de acceso a datos, tipos generados
  auth/             Sesión, rol del usuario y guard de gestores
  routing/          Estrategia de títulos de página
  layout/           Cabecera, navegación inferior y enlaces del menú
data-access/
  <entidad>/        <entidad>.service.ts   consultas a Supabase
                    <entidad>.mapper.ts    filas de la BD → interfaces de dominio
                    interfaces/            modelos de dominio
                    *.ts                   lógica pura del dominio (con su .spec.ts)
shared/
  components/       Componentes visuales reutilizables (icono, tablas, mensajes…)
  pipes/            Transformaciones para plantillas
  services/         Servicios del navegador sin datos del equipo (portapapeles…)
  utils/            Funciones puras (fechas, etiquetas)
features/
  <seccion>/
    pages/          Componentes enrutables: obtienen datos y componen la página
    components/     Componentes visuales propios de la sección
    services/       Orquestación de datos de la sección
    interfaces/     Tipos propios de la sección
```

Secciones actuales: `inicio`, `calendario`, `clasificacion`, `plantilla`, `estadisticas`,
`acceso` y `no-encontrado`.

Entidades de `data-access/`: `competiciones`, `equipos`, `partidos` (calendario, detalle con
acta, próximo partido y último resultado), `clasificacion`, `jugadores`, `estadisticas` y
`convocatorias`. Cada una tiene en `interfaces/` sus modelos de dominio (`*.interface.ts`) y
la forma de las filas que devuelve Supabase (`fila-*.type.ts`), y un `*.fixtures.ts` con filas
de ejemplo para los tests.

### Reglas de dependencia

```
features ──► shared ──► data-access ──► core
    └──────────────────────┘
```

- `features` puede usar `shared`, `data-access` y `core`, pero no otras features.
- `shared` no conoce ninguna feature.
- Solo `data-access` y `core` importan Supabase (ESLint lo impide en el resto).
- Si dos features necesitan lo mismo, se sube a `shared` o a `data-access`.

## Flujo de datos

Ejemplo de cómo será la portada cuando haya datos:

```
InicioPageComponent
  └─ DatosInicioService (provisto en la página, vive con ella)
       ├─ resource: PartidosService.obtenerProximoPartido()
       ├─ resource: ConvocatoriasService.obtenerConvocatoria(partido)   ← depende del partido
       ├─ resource: PartidosService.obtenerUltimoResultado()
       └─ resource: ClasificacionService.obtenerResumen()
```

- Los datos se cargan con `resource()`: cada uno expone `isLoading()`, `error()` y su valor,
  y se recarga solo cuando cambian sus parámetros.
- Las plantillas muestran un mensaje de estado mientras cargan, si fallan o si no hay datos.
- Los componentes visuales reciben datos de dominio por `input()` y no saben de dónde vienen.

## Modelo de dominio frente a base de datos

La base de datos usa `snake_case` (`fecha_hora`); el dominio usa `camelCase` (`fechaHora`).
La traducción ocurre solo en los mapeadores. Si cambia una columna:

1. Nueva migración.
2. `npm run db:tipos` regenera `database.types.ts`.
3. TypeScript señala los mapeadores afectados; el resto de la app no se entera.

## Sesión y permisos

- `AuthService` guarda la sesión de Supabase y lee el rol de la tabla `perfil`.
- `esGestor()` y `esAdmin()` solo adaptan la interfaz (mostrar u ocultar botones).
- `gestorGuard` lleva a `/acceso` a quien entra en una página de gestión sin permisos.
- Lo que de verdad protege los datos son las políticas RLS: aunque alguien manipulase la web,
  la base de datos rechazaría la operación. La función SQL `es_gestor()` sirve para
  escribirlas.

## Diseño

- Sistema de diseño en `web/src/styles/_tokens.scss`: tema oscuro con el negro y el salmón
  del escudo, tipografía Archivo (con su eje de anchura para los textos tipo marcador) y
  escalas de espacio y radio. Detalle en [`diseno.md`](diseno.md).
- Diseño pensado primero para móvil, con navegación inferior; en escritorio el menú pasa a la
  cabecera.
