import { Injectable, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConvocatoriasService } from '@data-access/convocatorias/convocatorias.service';
import { PartidosService } from '@data-access/partidos/partidos.service';
import {
  elegirProximoPartido,
  partidosDeNuestroEquipo,
} from '@data-access/partidos/proximo-partido';
import { elegirUltimoResultado } from '@data-access/partidos/resultado-partido';

/** Datos de la portada: próximo partido con su convocatoria, último resultado y clasificación. */
@Injectable()
export class DatosInicioService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly partidos = inject(PartidosService);
  private readonly clasificacion = inject(ClasificacionService);
  private readonly convocatorias = inject(ConvocatoriasService);

  readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });
  readonly calendario = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.partidos.obtenerCalendario(params),
  });
  readonly tabla = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.clasificacion.obtenerClasificacion(params),
  });

  readonly partidosNuestros = computed(() =>
    partidosDeNuestroEquipo(this.calendario.value() ?? []),
  );
  readonly proximo = computed(() => elegirProximoPartido(this.partidosNuestros(), new Date()));
  readonly ultimo = computed(() => elegirUltimoResultado(this.partidosNuestros()));

  readonly convocatoria = resource({
    params: () => this.proximo()?.id,
    loader: ({ params }) => this.convocatorias.obtenerConvocatoria(params),
  });

  readonly cargando = computed(() => this.competicion.isLoading() || this.calendario.isLoading());
  readonly error = computed(() => {
    const fallo = this.competicion.error() ?? this.calendario.error() ?? this.tabla.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se han podido cargar los datos.'
        : null;
  });
}
