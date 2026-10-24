# 0005. Dominio en castellano, técnicos en inglés y sufijos de tipo

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

El equipo habla castellano y Alex quiere que la estructura se lea sola. Angular, desde la
versión 20, genera ficheros sin sufijo (`tabla-clasificacion.ts`), y sus términos técnicos
son en inglés.

## Decisión

- Nombres del dominio en castellano, iguales en la base de datos, el código y la interfaz:
  `jugador`, `partido`, `convocatoria`, `obtenerClasificacion()`.
- Términos técnicos en inglés, como los usa Angular: `component`, `service`, `guard`,
  `pipe`, `mapper`, `resource`.
- Ficheros en `kebab-case` con sufijo de tipo: `.component.ts`, `.service.ts`, `.guard.ts`,
  `.pipe.ts`, `.mapper.ts`, `.strategy.ts`, `.interface.ts`, `.type.ts`. `angular.json`
  está configurado para que `ng generate` los añada.
- Prefijo de selectores `pits-`.

## Consecuencias

- Nombres algo más largos, a cambio de saber qué es cada fichero sin abrirlo.
- Algún nombre mixto inevitable (`JugadoresService`), que se acepta.
