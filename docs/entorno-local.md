# Entorno local

## Requisitos

- Node 24 (`.nvmrc`) y npm 11.
- Git con saltos de línea LF (`.gitattributes` lo fuerza).
- Para la base de datos: la CLI de Supabase se instala con `npm install` en la raíz. Para
  ejecutar Supabase en local hace falta Docker; para trabajar contra el proyecto en la nube,
  no.

## Primera vez

```bash
npm install            # raíz: husky y la CLI de Supabase
npm install --prefix web
npm start --prefix web # http://localhost:4200
```

`npm install` en la raíz instala el hook de pre-commit (lint-staged: ESLint y Prettier sobre
los ficheros que se van a subir).

### Conectar con Supabase

La web ya apunta al proyecto de Supabase `ozmhigfbexqgteiythfx` (URL y publishable key en
`web/src/environments/`, y la misma URL en `connect-src` de `web/public/_headers`). Para
trabajar con la base de datos desde la terminal:

1. `npx supabase login` (abre el navegador).
2. `npx supabase link --project-ref ozmhigfbexqgteiythfx` (pide la contraseña de la base
   de datos, que solo tiene Alex).
3. `npm run db:migrar` para aplicar las migraciones pendientes y `npm run db:tipos` para
   regenerar los tipos.

## Día a día

| Comando                               | Qué hace                                      |
| ------------------------------------- | --------------------------------------------- |
| `npm start --prefix web`              | Servidor de desarrollo                        |
| `npm test --prefix web`               | Tests en modo vigilancia                      |
| `npm run lint --prefix web`           | ESLint                                        |
| `npm run formatear --prefix web`      | Prettier sobre todo `web/`                    |
| `npm run verificar --prefix web`      | Todo lo que comprueba la integración continua |
| `npm run db:nueva-migracion -- nombre` | Crea una migración vacía                     |
| `npm run db:probar`                   | Ejecuta y comprueba las migraciones sin Docker |
| `npm run funciones:probar`            | Tipos, formato y tests de la Edge Function    |
| `npm run funciones:formatear`         | Formatea la Edge Function con Deno            |
| `npm run funciones:desplegar`         | Sube la Edge Function al proyecto             |
| `npm run db:migrar`                   | Aplica las migraciones pendientes en la nube  |
| `npm run db:tipos`                    | Regenera `database.types.ts`                  |

## Problemas frecuentes

- **El hook de pre-commit no se ejecuta**: falta `npm install` en la raíz.
- **ESLint se queja de una interfaz**: las interfaces y tipos van en ficheros propios
  `interfaces/<nombre>.interface.ts` o `.type.ts`.
- **Prettier y el editor discrepan**: el editor debe usar `web/node_modules/prettier`
  (`.vscode/settings.json` ya lo indica).
