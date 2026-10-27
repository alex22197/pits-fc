# Despliegue

La web es un proyecto de **Cloudflare Pages** y vive en <https://pits-fc.pages.dev>.
Cloudflare compila y publica solo cada vez que llega algo a `main`.

Se eligió Pages y no un Worker (como en `ctp-valdelasfuentes`) por la dirección: un Worker
cuelga del subdominio de la cuenta (`pits-fc.padel-ctp.workers.dev`), que es el de ctp,
mientras que Pages da `pits-fc.pages.dev` sin coste. Las versiones 0.1.x se sirvieron con un
Worker que ya no se usa.

## Cloudflare Pages (una sola vez)

1. En el panel de Cloudflare, ve a **Workers & Pages** → **Create** → pestaña **Pages** →
   **Import an existing Git repository** (si solo aparece la opción de Workers, el enlace
   «Looking to deploy Pages? Get started» lleva a la de Pages). Elige `alex22197/pits-fc`.
2. Configura la compilación:

   | Campo                  | Valor                      |
   | ---------------------- | -------------------------- |
   | Project name           | `pits-fc`                  |
   | Production branch      | `main`                     |
   | Framework preset       | None                       |
   | Build command          | `npm run build:cloudflare` |
   | Build output directory | `dist/pits-fc-web/browser` |
   | Root directory (path)  | `web`                      |

   La versión de Node la toma de `web/.nvmrc`. Si **Root directory** se queda vacío,
   Cloudflare compila desde la raíz del repositorio y falla con
   `Missing script: "build:cloudflare"`.

3. **Save and Deploy**. Después, en **Settings → Builds → Branch control**, deja
   **Automatic deployments** solo para la rama de producción.
4. La web queda en `https://pits-fc.pages.dev`. Si el nombre estuviera cogido, Cloudflare
   añade un sufijo y hay que cambiar la dirección en `index.html` (vista previa),
   `sitio.constants.ts` y Supabase.

`build:cloudflare` ejecuta linter y tests antes de compilar: si algo falla, no se publica y
la versión anterior sigue en línea. La configuración está en
[`web/wrangler.jsonc`](../web/wrangler.jsonc). Pages sirve `index.html` en cualquier ruta que
no exista mientras no haya un `404.html`, así que las rutas de Angular funcionan al recargar.
`web/public/_headers` fija las cabeceras de seguridad y la caché; Cloudflare lo lee tal cual.

## Compartir el enlace

- `index.html` lleva la vista previa para WhatsApp y otras apps (`og:title`, `og:image` con
  `imagenes/compartir.jpg`, cuadrada y ligera). Las URL de esas etiquetas son absolutas.
- La web no aparece en buscadores (`<meta name="robots" content="noindex, nofollow">`): es
  pública, pero solo llega quien tiene el enlace. Lo dice la página de privacidad.

## Medición de visitas

Cloudflare Web Analytics, sin cookies ni datos personales: visitas, páginas, de dónde se
llega, país y dispositivo, en conjunto (#29). Por eso no hay aviso de cookies y la página de
privacidad puede decir que no hay ninguna.

- Se activa en el proyecto de Pages: **Metrics** → **Web Analytics** → **Enable**. Cloudflare
  inyecta su script en cada página al servirla; no está en el repositorio.
- La política de contenido de `_headers` permite `https://static.cloudflareinsights.com`
  (script) y `https://cloudflareinsights.com` (envío de las visitas). Sin eso el navegador lo
  bloquea y no se cuenta nada.
- Las cifras se ven en el mismo sitio, **Metrics** → **Web Analytics**, o en **Analytics &
  Logs → Web Analytics** de la cuenta.

## Dar acceso a un gestor

Mientras no exista la invitación desde la web (#9):

1. La persona entra en `/acceso` con su cuenta de Google.
2. En Supabase, **Authentication → Users**, se copia su UID.
3. En **Table Editor → `perfil`**, se añade una fila con ese `user_id` y `rol` = `gestor`.
4. Al recargar la web, le aparece «Gestión» en la cabecera.

## Publicar una versión

1. Pull request de `develop` a `main` titulada «Publicación X.Y.Z», con la lista de lo que
   entra.
2. Cuando la integración continua está en verde, se integra con un merge commit cuyo mensaje
   es solo «Publicación X.Y.Z», sin cuerpo:

   ```bash
   gh pr merge <n> --merge --subject "Publicación X.Y.Z" --body ""
   ```

3. Se etiqueta ese merge commit con una etiqueta anotada con el mismo mensaje y se sube:

   ```bash
   git tag -a vX.Y.Z -m "Publicación X.Y.Z"
   git push origin vX.Y.Z
   ```

4. Cloudflare compila y publica solo.

El asistente hace la publicación entera (pull request, merge y etiqueta) cuando Alex lo pide;
es el mismo procedimiento que en `ctp-valdelasfuentes`.

Versiones: la cifra del medio sube con funcionalidades nuevas (0.2.0) y la última con
correcciones (0.2.1). La 1.0.0 será la primera que se comparta con el equipo.

## Supabase: direcciones permitidas para el login

En Authentication → URL Configuration:

- **Site URL**: `https://pits-fc.pages.dev`.
- **Redirect URLs**: `https://pits-fc.pages.dev/acceso` y `http://localhost:4200/acceso`.

Sin la de producción, «Entrar con Google» devuelve a `localhost` o da error.

## Google (login)

Aplicación OAuth en Google Cloud con el callback de Supabase; cliente y secreto se pegan en
el panel de Supabase (Authentication → Providers → Google), nunca en el repositorio.

## Cabeceras de seguridad

La política de contenido de `web/public/_headers` solo permite la propia web, Google Fonts y
el proyecto de Supabase. Cualquier origen nuevo se añade ahí antes de usarlo, o el navegador
lo bloqueará.

Como `script-src` no admite scripts en línea, la compilación de producción tiene desactivado
el CSS crítico en línea (`inlineCritical: false` en `web/angular.json`): Angular lo resuelve
con un pequeño script en `index.html` que la política bloquea, y entonces la hoja de estilos
se queda sin aplicar (pasó en la 0.1.1). En local no se nota, porque `ng serve` no usa estas
cabeceras: hay que comprobarlo en la dirección publicada.

## Claves y secretos

| Dónde                        | Qué                                      | Público |
| ---------------------------- | ---------------------------------------- | ------- |
| `web/src/environments/`      | URL y publishable key de Supabase        | Sí      |
| Panel de Supabase            | Secreto de Google OAuth                  | No      |
| Secretos de la Edge Function | `FEDERACION_USUARIO`, `FEDERACION_CLAVE` | No      |

## Integración continua

`.github/workflows/ci.yml` ejecuta linter, formato, tests y compilación en cada push a
`main` y `develop` y en cada pull request. Dependabot abre pull requests semanales contra
`develop` con las actualizaciones de dependencias.
