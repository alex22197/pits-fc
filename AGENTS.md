# AGENTS.md

Guía para cualquier persona o asistente de IA (Claude Code, Codex, Cursor, Copilot…) que
trabaje en este repositorio. Es la única fuente de las convenciones del proyecto: `CLAUDE.md`
solo la importa.

Las reglas marcadas con **(automática)** las comprueba ESLint, Prettier o TypeScript: si no se
cumplen, el commit se rechaza.

## Contexto

Web del equipo de fútbol 7 PITS FC (liga Ayto. Alcobendas Fútbol 7, 2ª Aficionados G2).
Pública para consultar; con login de Google para que los gestores metan datos. Calendario,
resultados, clasificación, goleadores y actas se traen de la intranet de la federación con un
scraper; las convocatorias las publican los gestores.

**Al empezar a trabajar, lee en este orden:**

1. [`docs/contexto.md`](docs/contexto.md): el equipo, la liga, las personas y las decisiones
   de producto.
2. [`docs/hoja-de-ruta.md`](docs/hoja-de-ruta.md): qué está hecho y qué toca ahora.
3. [`docs/arquitectura.md`](docs/arquitectura.md) y, según la tarea,
   [`docs/base-de-datos.md`](docs/base-de-datos.md), [`docs/scraper.md`](docs/scraper.md) o
   [`docs/diseno.md`](docs/diseno.md).

Al terminar un paso de la hoja de ruta, márcalo como hecho en ese mismo documento.

## Antes de terminar cualquier cambio

```bash
npm run verificar --prefix web
```

Ejecuta linter, formato, tests y compilación, igual que la integración continua. Un cambio
no está terminado hasta que pasa. Si el cambio toca `supabase/`, también `npm run db:probar`
(migraciones) y `npm run funciones:probar` (Edge Function), desde la raíz.

## Estructura

```
supabase/migrations/   Esquema de la base de datos, una migración por cambio
supabase/functions/    Funciones de Supabase (el scraper de la federación)
web/src/app/
  core/                Lo que existe una sola vez: configuración, cliente de Supabase,
                       sesión, enrutado y esqueleto de la app (cabecera, navegación)
  data-access/         Un servicio por entidad que habla con Supabase, más su mapeador
                       y sus interfaces de dominio
  shared/              Componentes, pipes y utilidades reutilizables, sin acceso a datos
  features/            Una carpeta por sección de la web, con pages/, components/,
                       services/ e interfaces/ según necesite
web/src/styles/        Sistema de diseño (variables) y estilos globales
docs/                  Documentación y registro de decisiones
```

Detalle en [`docs/arquitectura.md`](docs/arquitectura.md).

## Reglas de código

### Ficheros y lenguajes

- Cada lenguaje en su fichero: plantillas en `.html`, estilos en `.scss`, lógica en `.ts`.
  Nada de `template:` ni `styles:` en los componentes. **(automática)**
- Nada de estilos en línea en las plantillas (`style="…"`); los enlaces de datos tipo
  `[style.x]` solo para valores calculados. **(automática)**
- Nada de SQL dentro del TypeScript: las consultas complejas van como vistas o funciones en
  una migración.
- Iconos como ficheros en `web/public/iconos/`, usados con `<pits-icono nombre="…" />`.
- Máximo 200 líneas por fichero `.ts` (sin contar comentarios). Si crece, se divide. **(automática)**

### Nombres

- **Dominio en castellano**, igual que la base de datos: `jugador`, `partido`, `convocatoria`,
  `JugadoresService`, `obtenerClasificacion()`.
- **Términos técnicos en inglés**, como los usa Angular: `component`, `service`, `guard`,
  `pipe`, `mapper`.
- Ficheros en `kebab-case` con sufijo de tipo (ADR 0005):
  `tabla-clasificacion.component.ts`, `clasificacion.service.ts`, `gestor.guard.ts`,
  `partido.mapper.ts`, `fila-clasificacion.interface.ts`, `rol-usuario.type.ts`.
- Los nombres deben entenderse sin abrir el fichero: `datos-inicio.service.ts`, no `data.ts`.
- Prefijo de selectores: `pits-`. **(automática)**

### Interfaces y tipos

- Viven en una carpeta `interfaces/` junto al código que las usa: una interfaz o tipo
  por fichero, con sufijo `.interface.ts` o `.type.ts`. Ningún otro fichero `.ts` declara
  interfaces ni tipos (ADR 0007). **(automática)**
- Las interfaces de dominio usan `camelCase` y `readonly`. Las filas de la base de datos
  (`snake_case`) solo aparecen en los mapeadores.
- Los tipos de la base de datos (`core/supabase/interfaces/database.types.ts`) se generan
  con `npm run db:tipos`. **No se editan a mano.**
- TypeScript estricto: sin `any` y con tipo de retorno explícito en las funciones. **(automática)**

### Angular

- Componentes standalone con `ChangeDetectionStrategy.OnPush`. **(automática)**
- Estado con signals (`signal`, `computed`, `input`, `resource`); nada de `@Input()` ni
  `@Output()` con decoradores. **(automática)**
- Control de flujo nuevo en plantillas: `@if`, `@for`, `@let`. **(automática)**
- `inject()` en lugar de inyección por constructor.
- Rutas con carga diferida (`loadComponent`) y `title` en castellano.
- Páginas y componentes visuales separados: la página (`pages/`) obtiene los datos y los
  pasa por `input()` a componentes (`components/`) que solo los muestran. Un componente
  hace una sola cosa; si una plantilla pasa de una pantalla, se trocea.

### Capas

- Las páginas y componentes **no** importan Supabase: usan un servicio de `data-access/`.
  **(automática)**
- Cada servicio de `data-access/` devuelve interfaces de dominio pasando por su mapeador,
  y convierte los errores en `ErrorAccesoDatos` con un mensaje en castellano.
- La lógica que se pueda escribir como función pura (cálculos, formato de fechas, elección
  del próximo partido) va en un fichero propio con su test.

### Estilos

- Tema oscuro fijo con los colores del escudo (ADR 0006). Colores, espacios, radios y
  tipografía solo con las variables de `web/src/styles/_tokens.scss`; nunca valores sueltos.
- Puntos de corte con `@use 'breakpoints' as bp;` y `@include bp.desde(tablet)`.
- Clases globales reutilizables en `web/src/styles/_tipografia.scss` (`titulo-pagina`,
  `titulo-seccion`, `texto-secundario`, `boton`).
- Gráficas con ECharts solo a través de `pits-grafica` (`shared/components/grafica`), con
  las opciones comunes de `shared/utils/graficas` y los colores `--color-grafica-*` leídos
  en tiempo de ejecución por `TemaGraficasService`; cada gráfica lleva su tabla de datos. Un
  color nuevo se valida para fondo oscuro antes de usarlo (ver
  [`docs/diseno.md`](docs/diseno.md)).
- Animaciones que CSS no resuelve (mover un elemento de sitio, arrastrar, dibujar SVG) con
  GSAP, solo a través de `shared/utils/animacion` (ADR 0008), y siempre comprobando
  `movimientoReducido()`. Las transiciones simples siguen en CSS.
- Cualquier origen externo nuevo (scripts, estilos, letras, peticiones) se añade a la política
  de contenido de `web/public/_headers`; ver [`docs/despliegue.md`](docs/despliegue.md).

### Accesibilidad

- Reglas de accesibilidad de plantillas activadas. **(automática)**
- Objetivos táctiles de al menos 44 px, foco visible y textos alternativos.
- Textos de la interfaz en castellano, claros y en voz activa: «Entrar con Google»,
  no «Autenticarse».

### Privacidad

- El repositorio es público: nunca datos personales (nombres completos, teléfonos, correos)
  ni claves en el código, la documentación, las migraciones o los tests.
- Las credenciales de la intranet de la federación solo existen como secretos de Supabase
  (ADR 0003). No se escriben en ningún fichero ni se piden por chat.
- En lo público se muestran nombres cortos de nuestros jugadores y ningún nombre de rivales
  (ADR 0004).

## Tests

- Vitest con el runner de Angular (`npm test --prefix web`).
- Obligatorio para funciones puras, mapeadores y guards. Recomendado para componentes con
  lógica de presentación.
- El fichero de test va junto al código: `proximo-partido.ts` → `proximo-partido.spec.ts`.

## Base de datos

- Todo cambio de esquema es una migración nueva (`npm run db:nueva-migracion -- <nombre>`);
  nunca se edita una migración ya aplicada ni se cambia el esquema desde el panel de Supabase.
- Cada tabla nueva: RLS activado, políticas explícitas y `grant` solo de lo necesario (el
  proyecto no expone tablas automáticamente).
- Antes de dar por buena una migración, `npm run db:probar` (la ejecuta en un PostgreSQL
  embebido junto con las comprobaciones de `supabase/tests/`); cada regla nueva lleva su
  comprobación ahí.
- Tras aplicar la migración, `npm run db:tipos`.
- Quien termina una tarea con migración la aplica en Supabase (`npm run db:migrar`) después
  de probarla en local, si solo añade (funciones, vistas, tablas o columnas nuevas). Si
  borra, renombra o transforma datos existentes, lo confirma antes con Alex.

Detalle en [`docs/base-de-datos.md`](docs/base-de-datos.md).

## Git

### Issues

- Cada tarea pendiente es una issue en GitHub, con su milestone (sección de la hoja de
  ruta) y etiquetas de área y prioridad. Las tareas nuevas se crean primero como issue.
- La etiqueta «tarea de Alex» marca lo que se hace desde paneles o hablando con el equipo;
  «mejora futura», las ideas sin fecha.

### Ramas

- `main`: solo lo que está desplegado; Cloudflare publica cada cambio que llega. Recibe
  `develop` mediante una pull request «Publicación X.Y.Z» y se etiqueta `vX.Y.Z`.
- `develop`: rama principal de trabajo. Siempre pasa `npm run verificar --prefix web`.
- Una rama por tarea, creada desde `develop`, en castellano y `kebab-case`, con el número
  de su issue: `feature/6-convocatoria`, `fix/31-marcador-en-aplazado`,
  `docs/guia-de-despliegue` (las tareas sin issue, sin número).
- Al terminar la tarea se integra con `git merge --no-ff <rama>` (mensaje por defecto,
  `Merge branch '<rama>' into develop`).
- Las ramas integradas se conservan, para ver en el árbol el nombre de cada tarea.

### Commits

Siempre con este formato, en castellano:

```
<tipo>(<ámbito>): <resumen>

- Qué cambia y por qué, en viñetas.
- Una viñeta por idea.

Closes #<issue>
```

- **Pie** (`Closes #N`): solo en el commit que completa la issue. `Refs #N` en los
  intermedios.
- **Tipo**: `feat` (funcionalidad), `fix` (corrección), `docs`, `refactor`, `test`,
  `style` (formato), `perf`, `ci`, `build` o `chore` (mantenimiento).
- **Ámbito** (opcional): la parte afectada, como `db`, `web`, `auth`, `data-access`,
  `scraper`, `inicio`, `calendario` o `calidad`.
- **Resumen**: en minúscula, sin punto final y con 72 caracteres como máximo.
  Ejemplo: `feat(calendario): pantalla con las jornadas y los marcadores`.
