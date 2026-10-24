import { Injectable, computed, inject, resource, signal } from '@angular/core';
import type { CambiosJugador } from '@data-access/jugadores/interfaces/cambios-jugador.interface';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import type { EstadoGuardado } from '../interfaces/estado-guardado.interface';

/** Datos de la gestión de jugadores: la plantilla completa y el resultado de cada guardado. */
@Injectable()
export class DatosJugadoresGestionService {
  private readonly jugadores = inject(JugadoresService);

  readonly plantilla = resource({ loader: () => this.jugadores.obtenerPlantillaParaGestion() });
  readonly estados = signal<Readonly<Record<string, EstadoGuardado>>>({});
  readonly guardando = signal<string | null>(null);

  readonly error = computed(() => {
    const fallo = this.plantilla.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar la plantilla.'
        : null;
  });

  async guardar(id: string, cambios: CambiosJugador): Promise<void> {
    this.guardando.set(id);
    try {
      await this.jugadores.guardarJugador(id, cambios);
      this.anotar(id, { tipo: 'ok', mensaje: 'Guardado' });
      this.plantilla.reload();
    } catch (error) {
      this.anotar(id, {
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'No se ha podido guardar.',
      });
    } finally {
      this.guardando.set(null);
    }
  }

  private anotar(id: string, estado: EstadoGuardado): void {
    this.estados.update((estados) => ({ ...estados, [id]: estado }));
  }
}
