# 0006. Tema oscuro fijo con los colores del escudo

- Estado: Aceptada
- Fecha: 2026-10-24

## Contexto

Alex quiere que la web tenga los colores del escudo: negro y salmón. Se valoró un tema claro
con esos colores como marca, y un selector entre ambos.

## Decisión

- Tema oscuro único: fondo negro, superficies algo más claras, texto marfil y el salmón del
  escudo como único acento.
- Sin tema claro ni selector: menos estilos que mantener y la web se parece al escudo.
- `color-scheme: dark` para que los controles nativos del navegador también sean oscuros.

## Consecuencias

- Todos los colores de estado (victoria, derrota, tarjetas) se eligieron para contrastar
  sobre negro; cualquier color nuevo se comprueba contra el fondo y las superficies.
- Las gráficas leerán los colores de los tokens en tiempo de ejecución.
