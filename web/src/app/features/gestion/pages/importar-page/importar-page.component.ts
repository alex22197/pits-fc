import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { formatearFechaHora } from '@shared/utils/fechas/formatear-fecha';
import { DatosImportacionService } from '../../services/datos-importacion.service';

/** Importar de la federación ahora y ver el registro de las últimas importaciones. */
@Component({
  selector: 'pits-importar-page',
  imports: [RouterLink, MensajeEstadoComponent],
  providers: [DatosImportacionService],
  templateUrl: './importar-page.component.html',
  styleUrl: './importar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportarPageComponent {
  protected readonly datos = inject(DatosImportacionService);

  protected fecha(valor: Date): string {
    return formatearFechaHora(valor);
  }
}
