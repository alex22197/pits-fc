import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { ConvocatoriasService } from '@data-access/convocatorias/convocatorias.service';
import { PartidosService } from '@data-access/partidos/partidos.service';

/** Datos de la página de un partido: su acta y, si está publicada, su convocatoria. */
@Injectable()
export class DatosPartidoService {
  private readonly partidos = inject(PartidosService);
  private readonly convocatorias = inject(ConvocatoriasService);

  readonly idPartido = signal<string | null>(null);

  readonly detalle = resource({
    params: () => this.idPartido() ?? undefined,
    loader: ({ params }) => this.partidos.obtenerDetalle(params),
  });
  readonly convocatoria = resource({
    params: () => this.idPartido() ?? undefined,
    loader: ({ params }) => this.convocatorias.obtenerConvocatoria(params),
  });

  readonly cargando = computed(() => this.detalle.isLoading());
  readonly error = computed(() => {
    const fallo = this.detalle.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar el partido.'
        : null;
  });
}
