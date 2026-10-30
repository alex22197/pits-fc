import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';

// Único punto de entrada a GSAP (ADR 0008): registra los complementos una sola vez.
gsap.registerPlugin(Flip, Draggable, DrawSVGPlugin);

export { Draggable, Flip, gsap };
