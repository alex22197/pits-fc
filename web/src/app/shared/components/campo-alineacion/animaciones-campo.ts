import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { PUESTOS } from '@data-access/convocatorias/puestos';
import { gsap } from '@shared/utils/animacion/gsap';
import { MOVIMIENTO, movimientoReducido } from '@shared/utils/animacion/movimiento';

/**
 * Las animaciones de la pizarra, sobre su DOM: el campo que se dibuja a tiza, las fichas que
 * caen a su puesto, la onda al llegar y la ola cuando están los siete. Con «reducir
 * movimiento» no hace nada.
 */
export class AnimacionesCampo {
  constructor(private readonly raiz: HTMLElement) {}

  /** Al aparecer: las líneas se trazan y las fichas caen de la portería hacia delante. */
  entrada(): void {
    if (movimientoReducido()) {
      return;
    }
    const trazos = this.raiz.querySelectorAll('.lineas :not(.punto)');
    gsap.from(trazos, {
      drawSVG: 0,
      duration: MOVIMIENTO.trazo,
      ease: 'power2.inOut',
      stagger: 0.04,
    });
    gsap.from(this.raiz.querySelectorAll('.lineas .punto'), {
      opacity: 0,
      delay: MOVIMIENTO.trazo * 0.6,
    });
    gsap.from(this.fichasEnOrden(), {
      y: -36,
      scale: 0.4,
      opacity: 0,
      duration: MOVIMIENTO.caida,
      ease: 'back.out(2)',
      stagger: MOVIMIENTO.escalonado,
      delay: 0.25,
    });
  }

  /** Fichas que acaban de llegar sin vuelo: caen en su hueco con la onda. */
  llegadas(puestos: readonly PuestoAlineacion[]): void {
    if (movimientoReducido()) {
      return;
    }
    for (const puesto of puestos) {
      const ficha = this.raiz.querySelector(`[data-puesto="${puesto}"] .ficha--jugador`);
      if (ficha) {
        gsap.fromTo(
          ficha,
          { y: -24, scale: 0.3, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' },
        );
      }
      this.onda(puesto, 0.15);
    }
  }

  /** Dos anillos de tiza que se abren desde el hueco. */
  onda(puesto: PuestoAlineacion, retraso = 0): void {
    if (movimientoReducido()) {
      return;
    }
    const onda = this.raiz.querySelector(`[data-puesto="${puesto}"] .onda`);
    if (!onda) {
      return;
    }
    gsap
      .timeline({ delay: retraso })
      .fromTo(
        onda,
        { scale: 0.8, opacity: 0.9 },
        { scale: 2.6, opacity: 0, duration: 0.7, ease: 'power2.out' },
      )
      .fromTo(
        onda,
        { scale: 0.8, opacity: 0.6 },
        { scale: 2, opacity: 0, duration: 0.6, ease: 'power2.out' },
        0.18,
      );
  }

  /** Con los siete en su sitio: una ola recorre el equipo y las líneas brillan en salmón. */
  celebrar(retraso = 0): void {
    if (movimientoReducido()) {
      return;
    }
    const estilos = getComputedStyle(this.raiz);
    const marca = estilos.getPropertyValue('--color-marca').trim();
    gsap.to(this.fichasEnOrden(), {
      y: -14,
      scale: 1.18,
      duration: 0.2,
      ease: 'power1.out',
      stagger: MOVIMIENTO.escalonado,
      yoyo: true,
      repeat: 1,
      delay: retraso,
    });
    gsap.fromTo(
      this.raiz.querySelectorAll('.lineas :not(.punto)'),
      { stroke: marca },
      { stroke: marca, duration: 1.1, delay: retraso, clearProps: 'stroke', ease: 'none' },
    );
  }

  /** Las fichas ocupadas, del portero al delantero. */
  private fichasEnOrden(): Element[] {
    return PUESTOS.map((p) =>
      this.raiz.querySelector(`[data-puesto="${p.puesto}"] .ficha--jugador`),
    ).filter((ficha): ficha is Element => ficha !== null);
  }
}
