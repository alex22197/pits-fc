import { DOCUMENT, Injectable, inject } from '@angular/core';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';

/**
 * Lee los colores de las gráficas de las variables CSS de `_tokens.scss`. ECharts pinta en
 * un canvas y no entiende `var(--…)`, así que se resuelven una vez y se reparten.
 */
@Injectable({ providedIn: 'root' })
export class TemaGraficasService {
  private readonly documento = inject(DOCUMENT);
  private colores: ColoresGraficas | null = null;

  obtenerColores(): ColoresGraficas {
    this.colores ??= this.leer();
    return this.colores;
  }

  private leer(): ColoresGraficas {
    const estilos = getComputedStyle(this.documento.documentElement);
    const variable = (nombre: string): string => estilos.getPropertyValue(nombre).trim();
    return {
      nosotros: variable('--color-grafica-nosotros'),
      rival: variable('--color-grafica-rival'),
      victoria: variable('--color-grafica-victoria'),
      empate: variable('--color-grafica-empate'),
      derrota: variable('--color-grafica-derrota'),
      rejilla: variable('--color-grafica-rejilla'),
      texto: variable('--color-tinta'),
      textoTenue: variable('--color-tinta-tenue'),
      superficie: variable('--color-superficie'),
      superficieElevada: variable('--color-superficie-elevada'),
      borde: variable('--color-borde-fuerte'),
      fuente: variable('--fuente'),
    };
  }
}
