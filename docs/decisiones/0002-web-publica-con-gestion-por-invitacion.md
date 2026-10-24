# 0002. Web pública y gestión por invitación

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

La web es para los jugadores y el cuerpo técnico, que la consultarán desde el móvil con un
enlace de WhatsApp. Nadie quiere crear cuentas para ver un calendario. Solo unas pocas
personas meten datos (convocatorias, nombres cortos).

## Decisión

- La web es pública y no requiere cuenta para consultar.
- Solo los gestores inician sesión, con Google.
- Tener cuenta no da permisos: el administrador asigna el rol (`admin` o `gestor`) en la
  tabla `perfil`.
- Lo que no debe ser público (nombres completos de las actas, registro del scraper) solo lo
  leen los gestores, por RLS.

## Consecuencias

- Hay que cuidar qué se muestra en público: ver ADR 0004.
- Las pantallas de gestión están pensadas para que un gestor publique rápido, no para que
  cada jugador introduzca nada.
- Si algún día los jugadores marcan su disponibilidad en la web, bastará un rol `jugador`.
