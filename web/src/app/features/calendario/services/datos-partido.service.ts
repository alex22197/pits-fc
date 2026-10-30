import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { ActasService } from '@data-access/actas/actas.service';
import { ConvocatoriasService } from '@data-access/convocatorias/convocatorias.service';
import { PartidosService } from '@data-access/partidos/partidos.service';
import type { Alineacion } from '@shared/utils/alineacion/interfaces/alineacion.type';

/**
 * Datos de la página de un partido: su acta y, si está publicada, su convocatoria. Un gestor
 * puede colocar ahí mismo a los titulares del acta en la pizarra.
 */
@Injectable()
export class DatosPartidoService {
  private readonly partidos = inject(PartidosService);
  private readonly convocatorias = inject(ConvocatoriasService);
  private readonly actas = inject(ActasService);

  readonly idPartido = signal<string | null>(null);

  readonly detalle = resource({
    params: () => this.idPartido() ?? undefined,
    loader: ({ params }) => this.partidos.obtenerDetalle(params),
  });
  readonly convocatoria = resource({
    params: () => this.idPartido() ?? undefined,
    loader: ({ params }) => this.convocatorias.obtenerConvocatoria(params),
  });

  readonly guardandoAlineacion = signal(false);
  readonly errorAlineacion = signal<string | null>(null);

  /** Solo la primera carga: al recargar tras guardar, la página no se vacía. */
  readonly cargando = computed(() => this.detalle.isLoading() && !this.detalle.hasValue());
  readonly error = computed(() => {
    const fallo = this.detalle.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar el partido.'
        : null;
  });

  async guardarAlineacion(alineacion: Alineacion): Promise<void> {
    const id = this.idPartido();
    if (!id) {
      return;
    }
    this.guardandoAlineacion.set(true);
    this.errorAlineacion.set(null);
    try {
      await this.actas.guardarAlineacion(
        id,
        new Map([...alineacion].map(([puesto, jugador]) => [puesto, jugador.id])),
      );
      this.detalle.reload();
    } catch (error) {
      this.errorAlineacion.set(
        error instanceof Error ? error.message : 'No se ha podido guardar la alineación.',
      );
    } finally {
      this.guardandoAlineacion.set(false);
    }
  }
}
