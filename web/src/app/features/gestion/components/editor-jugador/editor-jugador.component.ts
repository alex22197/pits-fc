import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { CambiosJugador } from '@data-access/jugadores/interfaces/cambios-jugador.interface';
import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import type { PosicionJugador } from '@data-access/jugadores/interfaces/posicion-jugador.type';
import type { EstadoGuardado } from '../../interfaces/estado-guardado.interface';

const POSICIONES: readonly { valor: PosicionJugador | ''; etiqueta: string }[] = [
  { valor: '', etiqueta: 'Sin posición' },
  { valor: 'portero', etiqueta: 'Portero' },
  { valor: 'defensa', etiqueta: 'Defensa' },
  { valor: 'centrocampista', etiqueta: 'Centrocampista' },
  { valor: 'delantero', etiqueta: 'Delantero' },
];

/** Formulario de un jugador: nombre que se muestra, dorsal, posición y si sigue activo. */
@Component({
  selector: 'pits-editor-jugador',
  templateUrl: './editor-jugador.component.html',
  styleUrl: './editor-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorJugadorComponent {
  readonly jugador = input.required<JugadorGestion>();
  readonly estado = input<EstadoGuardado | null>(null);
  readonly guardando = input<boolean>(false);
  readonly guardar = output<CambiosJugador>();

  protected readonly posiciones = POSICIONES;

  // El formulario parte de lo guardado y solo cambia lo que toca el gestor.
  private readonly nombreEditado = signal<string | null>(null);
  private readonly dorsalEditado = signal<string | null>(null);
  private readonly posicionEditada = signal<PosicionJugador | '' | null>(null);
  private readonly activoEditado = signal<boolean | null>(null);

  protected readonly nombre = computed(
    () => this.nombreEditado() ?? this.jugador().jugador.nombreMostrar,
  );
  protected readonly dorsal = computed(
    () => this.dorsalEditado() ?? String(this.jugador().jugador.dorsal ?? ''),
  );
  protected readonly posicion = computed(
    () => this.posicionEditada() ?? this.jugador().jugador.posicion ?? '',
  );
  protected readonly activo = computed(() => this.activoEditado() ?? this.jugador().jugador.activo);
  protected readonly valido = computed(
    () => this.nombre().trim().length > 0 && dorsalValido(this.dorsal()),
  );

  protected cambiarNombre(evento: Event): void {
    this.nombreEditado.set((evento.target as HTMLInputElement).value);
  }

  protected cambiarDorsal(evento: Event): void {
    this.dorsalEditado.set((evento.target as HTMLInputElement).value);
  }

  protected cambiarPosicion(evento: Event): void {
    this.posicionEditada.set((evento.target as HTMLSelectElement).value as PosicionJugador | '');
  }

  protected cambiarActivo(evento: Event): void {
    this.activoEditado.set((evento.target as HTMLInputElement).checked);
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    if (!this.valido()) {
      return;
    }
    const posicion = this.posicion();
    this.guardar.emit({
      nombreMostrar: this.nombre().trim(),
      dorsal: this.dorsal().trim() === '' ? null : Number(this.dorsal()),
      posicion: posicion === '' ? null : posicion,
      activo: this.activo(),
    });
  }
}

function dorsalValido(texto: string): boolean {
  if (texto.trim() === '') {
    return true;
  }
  const numero = Number(texto);
  return Number.isInteger(numero) && numero >= 1 && numero <= 99;
}
