import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { ImportacionService } from '@data-access/importacion/importacion.service';
import type { EstadoGuardado } from '../interfaces/estado-guardado.interface';

/** Lanzar una importación a mano y ver las últimas. */
@Injectable()
export class DatosImportacionService {
  private readonly importacion = inject(ImportacionService);

  readonly ejecuciones = resource({ loader: () => this.importacion.obtenerEjecuciones() });
  readonly enCurso = signal(false);
  readonly estado = signal<EstadoGuardado | null>(null);

  readonly error = computed(() => {
    const fallo = this.ejecuciones.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se han podido cargar las importaciones.'
        : null;
  });

  async lanzar(): Promise<void> {
    this.enCurso.set(true);
    this.estado.set(null);
    try {
      await this.importacion.lanzar();
      this.estado.set({ tipo: 'ok', mensaje: 'Importación terminada.' });
    } catch (error) {
      this.estado.set({
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'La importación ha fallado.',
      });
    } finally {
      this.enCurso.set(false);
      this.ejecuciones.reload();
    }
  }
}
