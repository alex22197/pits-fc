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

| Uso                    | Variable            |
| ---------------------- | ------------------- |
| Victoria               | `--color-victoria`  |
| Empate                 | `--color-empate`    |
| Derrota                | `--color-derrota`   |
| Tarjeta amarilla       | `--color-amarilla`  |
| Tarjeta roja           | `--color-roja`      |

Todos cumplen 4,5:1 sobre el fondo y las superficies.

## Disposición

- Móvil primero: navegación inferior con las cinco secciones; en tableta y escritorio el menú
  pasa a la cabecera.
- Contenido centrado a `--ancho-contenido` (72 rem).
- Tarjetas con `--radio-contenedor`, borde `--color-borde` y fondo `--color-superficie`.
- Objetivos táctiles de 44 px como mínimo y foco visible en salmón.

## Escudo y favicon

Pendiente: dejar el escudo en `web/public/imagenes/escudo-pits-fc.png` (mínimo 512 px) y
generar `favicon.ico` y `apple-touch-icon.png` a partir de él. La cabecera lo mostrará junto
al nombre.
