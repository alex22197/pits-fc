# Diseño

## Identidad

El escudo es un círculo negro con un gorila y diez estrellas en salmón, y el nombre «PITS FC»
en mayúsculas redondeadas. De ahí salen las dos decisiones de base (ADR 0006):

- **Tema oscuro fijo**: fondo negro (`--color-fondo: #0d0d0d`), superficies algo más claras
  y texto marfil. No hay tema claro ni selector.
- **Salmón como único acento** (`--color-marca: #efa882`): enlaces, sección activa, botón
  principal, nuestro equipo en las tablas. Sobre salmón el texto va en negro.

Todos los valores están en `web/src/styles/_tokens.scss`; los componentes solo usan variables.

## Tipografía

Archivo (Google Fonts) con su eje de anchura:

- `titulo-pagina`: condensada, mayúsculas, como las letras del escudo.
- Cifras de marcadores y jornadas (`--texto-cifra`) también condensadas.
- Texto corriente a 16 px, secundario a 14 px.

## Colores de estado

| Uso              | Variable           |
| ---------------- | ------------------ |
| Victoria         | `--color-victoria` |
| Empate           | `--color-empate`   |
| Derrota          | `--color-derrota`  |
| Tarjeta amarilla | `--color-amarilla` |
| Tarjeta roja     | `--color-roja`     |

Todos cumplen 4,5:1 sobre el fondo y las superficies.

## Gráficas

Apache ECharts (`ngx-echarts`) a través de `pits-grafica` (`shared/components/grafica`), que
añade título, descripción y los mismos datos en una tabla plegada, para que nada dependa del
color ni del ratón. Las opciones comunes están en `shared/utils/graficas/opciones-base.ts`:
barras de 24 px como máximo con la punta redondeada, líneas de 2 px con marcadores rodeados
por la superficie, rejilla de un paso sobre el fondo y ayudas en texto plano (nunca HTML).

Los colores de las series son tokens aparte de los de marca, porque el salmón es demasiado
claro para una marca de gráfica sobre negro. Están validados para fondo oscuro (banda de
luminosidad, separación para daltonismo y contraste):

| Token                      | Valor     | Uso                                   |
| -------------------------- | --------- | ------------------------------------- |
| `--color-grafica-nosotros` | `#d9773a` | Nuestras series                       |
| `--color-grafica-rival`    | `#4f86c6` | Lo que hace el rival                  |
| `--color-grafica-victoria` | `#199e70` | Resultado: victoria                   |
| `--color-grafica-empate`   | `#c98500` | Resultado: empate; tarjetas amarillas |
| `--color-grafica-derrota`  | `#d55181` | Resultado: derrota; tarjetas rojas    |
| `--color-grafica-rejilla`  | `#2a2a2a` | Rejilla y ejes                        |

Reglas: una sola escala por gráfica; leyenda siempre que haya dos series y ninguna con una;
el texto (ejes, etiquetas, leyenda) con los colores de texto, nunca con el de la serie; un
color nuevo se valida antes de usarlo.

## Disposición

- Móvil primero: navegación inferior con las cinco secciones; en tableta y escritorio el menú
  pasa a la cabecera.
- Contenido centrado a `--ancho-contenido` (72 rem).
- Tarjetas con `--radio-contenedor`, borde `--color-borde` y fondo `--color-superficie`.
- Objetivos táctiles de 44 px como mínimo y foco visible en salmón.

## Escudo y favicon

El escudo original es un JPG con el círculo sobre fondo blanco. En `web/public/` están las
versiones derivadas, todas PNG con el fondo transparente para que funcionen sobre el tema
oscuro:

| Fichero                           | Uso                                 |
| --------------------------------- | ----------------------------------- |
| `imagenes/escudo-pits-fc-512.png` | Portada y cualquier sitio en grande |
| `imagenes/escudo-pits-fc-96.png`  | Cabecera (se muestra a 44 px)       |
| `favicon.png` (64 px)             | Pestaña del navegador               |
| `apple-touch-icon.png` (180 px)   | Icono al añadir la web al móvil     |

Si cambia el escudo, se regeneran los cuatro a partir del original (fondo blanco → alfa,
reescalado); no se retocan a mano.

## La pizarra

La alineación se coloca sobre un campo de fútbol 7 dibujado como la pizarra del míster
(`pits-campo-alineacion`): fondo verde pino apagado (`--color-pizarra`), líneas a tiza
(`--color-tiza`) y fichas en salmón con el dorsal en letra condensada. Es el único elemento
llamativo de esa pantalla; las listas de alrededor se quedan en silencio. Los puestos vacíos
van en tiza discontinua; cuando hay un jugador esperando sitio, pasan a salmón. Al colocar una
ficha hay un único movimiento corto («aterrizar»), que se anula con «reducir movimiento».
