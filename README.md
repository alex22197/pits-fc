# PITS FC

Web del equipo de fútbol 7 PITS FC: calendario, convocatorias, resultados, clasificación y
estadísticas de la liga Ayto. Alcobendas Fútbol 7.

- **Web**: Angular 22, en `web/`.
- **Datos y login**: Supabase, en `supabase/`.
- **Documentación**: `docs/`. Empieza por [`docs/contexto.md`](docs/contexto.md).
- **Convenciones**: [`AGENTS.md`](AGENTS.md).

## Arrancar en local

```bash
npm install
npm install --prefix web
npm start --prefix web
```

La web queda en <http://localhost:4200>. Detalle y problemas frecuentes en
[`docs/entorno-local.md`](docs/entorno-local.md).

## Antes de dar por bueno un cambio

```bash
npm run verificar --prefix web
```
