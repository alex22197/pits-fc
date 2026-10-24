import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';

/** Clasificación completa del grupo, tal como la publica la federación. */
@Component({
  selector: 'pits-clasificacion-page',
  imports: [MensajeEstadoComponent, TablaClasificacionComponent],
  templateUrl: './clasificacion-page.component.html',
  styleUrl: './clasificacion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionPageComponent {
  private readonly competiciones = inject(CompeticionesService);
  private readonly clasificacion = inject(ClasificacionService);

  protected readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });
  protected readonly tabla = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.clasificacion.obtenerClasificacion(params),
  });

  protected readonly cargando = computed(
    () => this.competicion.isLoading() || this.tabla.isLoading(),
  );
  protected readonly error = computed(() => {
    const fallo = this.competicion.error() ?? this.tabla.error();
    return fallo instanceof Error
      ? fallo.message
      : fallo
        ? 'No se ha podido cargar la clasificación.'
        : null;
  });
}
