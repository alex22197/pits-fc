# Despliegue

La web es un sitio estático en Cloudflare Workers (lo que antes era Cloudflare Pages), igual
que en `ctp-valdelasfuentes`. Cloudflare compila y publica solo cada vez que llega algo a
`main`.

## Cloudflare (una sola vez)

1. En el panel de Cloudflare, ve a **Workers & Pages** → **Create** → **Import a repository**
   y da acceso a la cuenta de GitHub al repositorio `alex22197/pits-fc`.
2. Configura la compilación:

   | Campo             | Valor                      |
   | ----------------- | -------------------------- |
   | Project name      | `pits-fc`                  |
   | Production branch | `main`                     |
   | Root directory    | `web`                      |
   | Build command     | `npm run build:cloudflare` |
   | Deploy command    | `npx wrangler deploy`      |

   La versión de Node la toma de `web/.nvmrc`; no hace falta ninguna variable de entorno.
   Si **Root directory** se queda vacío, Cloudflare compila desde la raíz del repositorio y
   falla con `Missing script: "build:cloudflare"`.

3. Desactiva **Builds for non-production branches**: solo se publica lo que llega a `main`.
4. Guarda y despliega. La web queda en `https://pits-fc.<subdominio>.workers.dev`, donde el
   subdominio es el de la cuenta de Cloudflare.

`build:cloudflare` ejecuta linter y tests antes de compilar: si algo falla, no se publica y
la versión anterior sigue en línea. La configuración del sitio está en
[`web/wrangler.jsonc`](../web/wrangler.jsonc); `single-page-application` hace que cualquier
ruta de Angular (`/clasificacion`, `/calendario/partido/…`) funcione al recargar la página.
`web/public/_headers` fija las cabeceras de seguridad y la caché; Cloudflare lo lee tal cual.

## Publicar una versión

1. Pull request de `develop` a `main` titulada «Publicación X.Y.Z», con la lista de lo que
   entra.
2. Cuando la integración continua está en verde, se integra con un merge commit y se etiqueta
   `main` con `vX.Y.Z`.
3. Cloudflare compila y publica solo.

Versiones: la cifra del medio sube con funcionalidades nuevas (0.2.0) y la última con
correcciones (0.2.1). La 1.0.0 será la primera que se comparta con el equipo.

## Supabase: direcciones permitidas para el login

En Authentication → URL Configuration:

- **Site URL**: la dirección de producción (`https://pits-fc.<subdominio>.workers.dev`).
- **Redirect URLs**: `https://pits-fc.<subdominio>.workers.dev/acceso` y
  `http://localhost:4200/acceso`.

Sin la de producción, «Entrar con Google» devuelve a `localhost` o da error.

## Google (login)

Aplicación OAuth en Google Cloud con el callback de Supabase; cliente y secreto se pegan en
el panel de Supabase (Authentication → Providers → Google), nunca en el repositorio.

## Cabeceras de seguridad

La política de contenido de `web/public/_headers` solo permite la propia web, Google Fonts y
el proyecto de Supabase. Cualquier origen nuevo se añade ahí antes de usarlo, o el navegador
lo bloqueará.

## Claves y secretos

| Dónde                           | Qué                                            | Público |
| ------------------------------- | ---------------------------------------------- | ------- |
| `web/src/environments/`         | URL y publishable key de Supabase              | Sí      |
| Panel de Supabase               | Secreto de Google OAuth                        | No      |
| Secretos de la Edge Function    | `FEDERACION_USUARIO`, `FEDERACION_CLAVE`       | No      |

## Integración continua

`.github/workflows/ci.yml` ejecuta linter, formato, tests y compilación en cada push a
`main` y `develop` y en cada pull request. Dependabot abre pull requests semanales contra
`develop` con las actualizaciones de dependencias.
