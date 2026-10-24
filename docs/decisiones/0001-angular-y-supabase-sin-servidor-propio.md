# 0001. Angular y Supabase, sin servidor propio

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

Alex programa en Angular y ya mantiene `ctp-valdelasfuentes` con Angular 22 y Supabase. El
presupuesto es cero y no hay nadie para operar un servidor.

## Decisión

- Web en Angular 22 (standalone, signals, Vitest), en `web/`.
- Supabase como base de datos (PostgreSQL con RLS), API y login con Google. El scraper
  corre como Edge Function dentro de Supabase.
- Web estática en Cloudflare Pages.
- Misma estructura, herramientas de calidad y convenciones que `ctp-valdelasfuentes`, para
  moverse entre los dos proyectos sin pensar.

## Consecuencias

- Toda la seguridad está en las políticas RLS: la web habla con Supabase con una clave
  pública.
- Sin servidor propio no hay lógica de negocio fuera de la base de datos y de la Edge
  Function.
- Planes gratuitos de Supabase y Cloudflare: hay límites de almacenamiento y de ejecuciones,
  de sobra para un equipo.
