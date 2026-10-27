import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { DecisionConvocatoria } from '@data-access/convocatorias/interfaces/decision-convocatoria.interface';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { nombreDelPuesto } from '@data-access/convocatorias/puestos';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import { CampoAlineacionComponent } from '@shared/components/campo-alineacion/campo-alineacion.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';
import { PortapapelesService } from '@shared/services/portapapeles.service';
import type { OpcionDecision } from '../../interfaces/opcion-decision.type';
import type { SeleccionPendiente } from '../../interfaces/seleccion-pendiente.type';
import { DatosConvocatoriaGestionService } from '../../services/datos-convocatoria-gestion.service';

const OPCIONES: readonly { valor: OpcionDecision; etiqueta: string }[] = [
  { valor: '', etiqueta: 'Sin decidir' },
  { valor: 'titular', etiqueta: 'Titular' },
  { valor: 'convocado', etiqueta: 'Banquillo' },
  { valor: 'duda', etiqueta: 'Duda' },
  { valor: 'descartado', etiqueta: 'No va' },
];

const SITUACION = { convocado: 'Banquillo', duda: 'Duda', descartado: 'No va' } as const;

/** Preparar y publicar la alineación de un partido: la pizarra y la plantilla. */
@Component({
  selector: 'pits-convocatoria-gestion-page',
  imports: [RouterLink, CampoAlineacionComponent, MensajeEstadoComponent, FechaPartidoPipe],
  providers: [DatosConvocatoriaGestionService],
  templateUrl: './convocatoria-gestion-page.component.html',
  styleUrl: './convocatoria-gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaGestionPageComponent {
  protected readonly datos = inject(DatosConvocatoriaGestionService);
  private readonly portapapeles = inject(PortapapelesService);

  protected readonly opciones = OPCIONES;
  protected readonly copiado = signal<string | null>(null);
  protected readonly pendiente = signal<SeleccionPendiente | null>(null);

  protected readonly puestoActivo = computed(() => {
    const pendiente = this.pendiente();
    return pendiente?.tipo === 'puesto' ? pendiente.puesto : null;
  });
  protected readonly ofrecerHuecos = computed(() => this.pendiente()?.tipo === 'jugador');

  /** Quién ocupa el puesto que se está decidiendo. */
  protected readonly ocupante = computed(() => {
    const puesto = this.puestoActivo();
    return puesto ? (this.datos.titulares().get(puesto) ?? null) : null;
  });

  protected readonly ayuda = computed(() => {
    const pendiente = this.pendiente();
    if (pendiente?.tipo === 'jugador') {
      return `Toca el hueco donde juega ${this.nombre(pendiente.jugadorId)}.`;
    }
    if (pendiente?.tipo === 'puesto') {
      const ocupante = this.ocupante();
      return ocupante
        ? `${ocupante.nombreMostrar} juega de ${nombreDelPuesto(pendiente.puesto).toLowerCase()}. Elige a otro o deja el puesto libre.`
        : `¿Quién juega de ${nombreDelPuesto(pendiente.puesto).toLowerCase()}?`;
    }
    const colocados = this.datos.titulares().size;
    return colocados === 7
      ? 'Los siete titulares están colocados.'
      : `Toca un hueco de la pizarra para poner a un titular (${colocados} de 7).`;
  });

  /** Para el puesto activo: toda la plantilla menos quien ya lo ocupa, con su situación. */
  protected readonly candidatos = computed(() => {
    const ocupante = this.ocupante();
    return (this.datos.plantilla.value() ?? [])
      .filter((jugador) => jugador.id !== ocupante?.id)
      .map((jugador) => ({ jugador, situacion: this.situacion(jugador) }));
  });

  protected elegirPartido(evento: Event): void {
    this.pendiente.set(null);
    this.datos.elegirPartido((evento.target as HTMLSelectElement).value);
  }

  protected pulsarPuesto(puesto: PuestoAlineacion): void {
    const pendiente = this.pendiente();
    if (pendiente?.tipo === 'jugador') {
      this.datos.colocar(pendiente.jugadorId, puesto);
      this.pendiente.set(null);
    } else if (pendiente?.tipo === 'puesto' && pendiente.puesto === puesto) {
      this.pendiente.set(null);
    } else {
      this.pendiente.set({ tipo: 'puesto', puesto });
    }
  }

  protected elegirCandidato(jugadorId: string): void {
    const puesto = this.puestoActivo();
    if (puesto) {
      this.datos.colocar(jugadorId, puesto);
    }
    this.pendiente.set(null);
  }

  protected dejarLibre(): void {
    const puesto = this.puestoActivo();
    if (puesto) {
      this.datos.vaciar(puesto);
    }
    this.pendiente.set(null);
  }

  protected cancelar(): void {
    this.pendiente.set(null);
  }

  protected valorDe(decision: DecisionConvocatoria | undefined): OpcionDecision {
    return decision ? (decision.puesto ? 'titular' : decision.estado) : '';
  }

  protected etiquetaDe(opcion: OpcionDecision, decision: DecisionConvocatoria | undefined): string {
    if (opcion === 'titular' && decision?.puesto) {
      return `Titular · ${nombreDelPuesto(decision.puesto)}`;
    }
    return OPCIONES.find((o) => o.valor === opcion)?.etiqueta ?? '';
  }

  protected decidir(jugadorId: string, evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as OpcionDecision;
    if (valor === 'titular') {
      // Entra en el banquillo ya; sube al campo en cuanto el gestor toque un hueco.
      this.datos.decidir(jugadorId, 'convocado');
      this.pendiente.set({ tipo: 'jugador', jugadorId });
      return;
    }
    this.datos.decidir(jugadorId, valor === '' ? null : valor);
    if (this.pendiente()?.tipo === 'jugador') {
      this.pendiente.set(null);
    }
  }

  protected anotar(jugadorId: string, evento: Event): void {
    this.datos.anotar(jugadorId, (evento.target as HTMLInputElement).value);
  }

  protected async copiar(): Promise<void> {
    const ok = await this.portapapeles.copiar(this.datos.texto());
    this.copiado.set(
      ok
        ? 'Texto copiado. Pégalo en WhatsApp.'
        : 'No se ha podido copiar; selecciona el texto y cópialo a mano.',
    );
  }

  private nombre(jugadorId: string): string {
    return (
      this.datos.plantilla.value()?.find((jugador) => jugador.id === jugadorId)?.nombreMostrar ??
      'el jugador'
    );
  }

  private situacion(jugador: Jugador): string {
    const decision = this.datos.decisiones().get(jugador.id);
    if (!decision) {
      return '';
    }
    return decision.puesto
      ? `Juega de ${nombreDelPuesto(decision.puesto).toLowerCase()}`
      : SITUACION[decision.estado];
  }
}
