import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { Draggable, Flip, gsap } from '@shared/utils/animacion/gsap';
import { MOVIMIENTO, movimientoReducido } from '@shared/utils/animacion/movimiento';
import type { DestinoArrastre } from './interfaces/destino-arrastre.type';

const FICHAS_ARRASTRABLES = '.ficha-lista, [data-puesto] .ficha--jugador';
const UMBRAL_SOBRE_HUECO = '35%';

/**
 * Lo que el editor de la alineación hace con GSAP sobre su DOM: capturar dónde está cada
 * ficha antes de un cambio para que, después, vuele a su sitio nuevo (Flip), y hacer las
 * fichas arrastrables (Draggable) avisando de dónde se sueltan.
 */
export class AnimacionesEditor {
  private arrastres: Draggable[] = [];

  constructor(private readonly raiz: HTMLElement) {}

  /** Foto de las fichas antes de un cambio; `null` si no hay que animar. */
  capturar(): Flip.FlipState | null {
    return movimientoReducido() ? null : Flip.getState(this.fichas());
  }

  /** Tras el cambio ya pintado, cada ficha vuela desde donde estaba en la foto. */
  volar(estado: Flip.FlipState | null, alAterrizar: () => void): void {
    if (!estado) {
      alAterrizar();
      return;
    }
    Flip.from(estado, {
      targets: this.fichas(),
      duration: MOVIMIENTO.vuelo,
      ease: 'power3.inOut',
      absolute: true,
      zIndex: 40,
      onEnter: (nuevas) =>
        gsap.fromTo(nuevas, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3 }),
      onComplete: alAterrizar,
    });
  }

  /** Vuelve arrastrables las fichas pintadas ahora (lista y campo). */
  prepararArrastre(
    alSoltar: (jugadorId: string, destino: DestinoArrastre, ficha: HTMLElement) => void,
  ): void {
    this.destruir();
    const huecos = [...this.raiz.querySelectorAll<HTMLElement>('[data-puesto]')];
    const campo = this.raiz.querySelector('.campo');
    const bajo = (arrastre: Draggable): HTMLElement | undefined =>
      huecos.find((hueco) => arrastre.hitTest(hueco, UMBRAL_SOBRE_HUECO));

    this.arrastres = Draggable.create(this.raiz.querySelectorAll(FICHAS_ARRASTRABLES), {
      type: 'x,y',
      dragClickables: true,
      minimumMovement: 6,
      zIndexBoost: true,
      onDragStart(this: Draggable) {
        gsap.to(this.target, { scale: 1.15, duration: 0.15, overwrite: 'auto' });
      },
      onDrag(this: Draggable) {
        const sobre = bajo(this);
        huecos.forEach((hueco) => hueco.classList.toggle('hueco--sobrevolado', hueco === sobre));
      },
      onDragEnd(this: Draggable) {
        huecos.forEach((hueco) => hueco.classList.remove('hueco--sobrevolado'));
        const ficha = this.target as HTMLElement;
        const jugadorId = idDe(ficha);
        const puesto = bajo(this)?.dataset['puesto'] as PuestoAlineacion | undefined;
        const desdeCampo = ficha.closest('[data-puesto]') !== null;
        if (jugadorId && puesto) {
          alSoltar(jugadorId, puesto, ficha);
        } else if (jugadorId && desdeCampo && campo && !this.hitTest(campo, '50%')) {
          alSoltar(jugadorId, 'fuera', ficha);
        } else {
          gsap.to(ficha, { x: 0, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)' });
        }
      },
    });
  }

  /** La ficha soltada vuelve a su sitio en el DOM antes de pintar el cambio. */
  soltar(ficha: HTMLElement): void {
    gsap.killTweensOf(ficha);
    gsap.set(ficha, { x: 0, y: 0, scale: 1 });
  }

  destruir(): void {
    this.arrastres.forEach((arrastre) => arrastre.kill());
    this.arrastres = [];
  }

  private fichas(): Element[] {
    return [...this.raiz.querySelectorAll('[data-flip-id]')];
  }
}

/** El jugador de una ficha: lo lleva ella o el disco de su dorsal. */
function idDe(ficha: HTMLElement): string | null {
  return (
    ficha.dataset['flipId'] ??
    ficha.querySelector<HTMLElement>('[data-flip-id]')?.dataset['flipId'] ??
    null
  );
}
