# 0007. Interfaces y tipos en ficheros propios

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

Alex quiere un proyecto muy organizado, con cada cosa en su sitio y sin interfaces
declaradas dentro de componentes o servicios, donde cuesta encontrarlas y acaban
duplicadas.

## Decisión

- Cada interfaz o tipo va en su propio fichero, en una carpeta `interfaces/` junto al código
  que lo usa: `interfaces/fila-clasificacion.interface.ts`, `interfaces/estado-partido.type.ts`.
- Ningún otro fichero `.ts` declara `interface` ni `type`. ESLint lo comprueba
  (`no-restricted-syntax`), con excepción de los tests y de los tipos generados de Supabase.
- Si una interfaz la usan dos sitios, sube a `data-access/<entidad>/interfaces/` o a
  `shared/`.

## Consecuencias

- Más ficheros pequeños, pero cualquier modelo se encuentra por su nombre.
- Los tipos auxiliares de una función (por ejemplo, el resultado de un cálculo) también van
  en `interfaces/`, aunque solo los use un fichero.
