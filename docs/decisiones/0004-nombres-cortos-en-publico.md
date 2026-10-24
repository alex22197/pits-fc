# 0004. Nombres cortos en público y ningún nombre de rivales

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

Las actas de la federación traen los nombres completos de todos los jugadores, de los
rivales y del árbitro. La web es pública (ADR 0002) y el repositorio también.

## Decisión

- De nuestros jugadores se muestra en público un nombre corto o apodo que decide Alex
  (`jugador.nombre_mostrar`). El nombre tal como figura en las actas va en
  `jugador_privado`, que solo leen los gestores, y sirve para que el scraper reconozca a
  cada uno.
- Los goles de los rivales se guardan sin autor. No se almacenan nombres de jugadores
  rivales ni de árbitros.
- Si un jugador no quiere aparecer, se muestra como «Jugador» con su dorsal.
- Nada de datos personales en el repositorio: ni en documentación, ni en migraciones de
  datos, ni en tests.

## Consecuencias

- La tabla de goleadores del grupo solo puede mostrarse por equipo, o con nuestros jugadores
  con nombre y el resto como «Jugador de <equipo>».
- Antes de publicar la web se avisará al equipo de qué se muestra.
