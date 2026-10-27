import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { calcularProximaImportacion } from '@data-access/importacion/proxima-importacion';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { describirMomento } from '@shared/utils/fechas/describir-momento';
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
  private readonly ahora = new Date();
  protected readonly proxima = describirMomento(calcularProximaImportacion(this.ahora), this.ahora);

  protected fecha(valor: Date): string {
    return formatearFechaHora(valor);
  }
}
