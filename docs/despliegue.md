# Despliegue

Pendiente de hacer la primera vez. Este documento recoge el plan; se completa con los pasos
reales cuando se haga.

## Cloudflare Pages (una sola vez)

- Proyecto conectado al repositorio `alex22197/pits-fc`, rama `main`.
- Comando de compilación: `npm ci && npm run build` con directorio raíz `web`.
- Directorio de salida: `web/dist/pits-fc-web/browser`.
- Variable `NODE_VERSION=24`.
- `web/public/_headers` fija las cabeceras de seguridad y la caché; Cloudflare lo lee tal cual.

## Publicar una versión

1. `develop` pasa `npm run verificar --prefix web`.
2. Pull request «Publicación X.Y.Z» de `develop` a `main`.
3. Al fusionar, Cloudflare publica. Etiquetar `vX.Y.Z`.

## Supabase: direcciones permitidas para el login

En Authentication → URL Configuration: la URL de producción y `http://localhost:4200`, ambas
con `/acceso` como ruta de vuelta.

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
