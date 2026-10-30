# 0008. Animaciones con GSAP

- Estado: Aceptada
- Fecha: 2026-10-30

## Contexto

Alex quiere una web viva, con animaciones llamativas, empezando por la pizarra de la
alineación (#39): que las fichas vuelen desde la lista hasta su puesto, poder arrastrarlas y
que el campo se dibuje a tiza. Con CSS se pueden hacer transiciones sueltas, pero no mover un
elemento de un sitio a otro del DOM ni arrastrar con física. Se valoraron Motion (antes
Framer Motion), anime.js y GSAP.

## Decisión

- **GSAP 3** (`gsap` en npm, versión fija) para las animaciones que CSS no resuelve bien:
  - `Flip`: anima un elemento que cambia de sitio en el DOM, como la ficha que pasa de la
    lista al campo.
  - `Draggable`: arrastrar fichas con ratón o dedo, con detección de dónde se sueltan.
  - `DrawSVGPlugin`: dibujar las líneas del campo como si fueran de tiza.
- Desde 2025 GSAP y todos sus complementos son gratuitos (licencia «Standard No Charge»), lo
  que permite usarlos en un proyecto sin ánimo de lucro como este. Se sirve desde el propio
  paquete de la web: no hace falta tocar la política de contenido.
- Se usa solo a través de `shared/utils/animacion`, que registra los complementos y ofrece
  `movimientoReducido()` y los tiempos comunes. Las transiciones simples (hover, foco,
  aparecer) siguen en CSS.
- Con «reducir movimiento» activado no hay vuelos, caídas ni dibujos: los cambios se ven al
  instante. Arrastrar sigue funcionando, porque lo provoca la persona.

## Consecuencias

- La librería pesa unos 50 kB comprimidos con sus complementos, pero solo se descarga con
  las páginas que la usan (carga diferida), no en el paquete inicial.
- La licencia de GSAP no es de código abierto: si la web llegara a ser un producto de pago,
  habría que revisarla.
- La guía de animación (#14) partirá de esta decisión.
