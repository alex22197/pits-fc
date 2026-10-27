import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { describirMomento } from '@shared/utils/fechas/describir-momento';

/** Cuándo se trajeron por última vez los datos de la federación y cuándo será la próxima. */
@Component({
  selector: 'pits-aviso-actualizacion',
  templateUrl: './aviso-actualizacion.component.html',
  styleUrl: './aviso-actualizacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvisoActualizacionComponent {
  /** Fin de la última importación correcta; `null` si no la hay o no se ha podido saber. */
  readonly ultima = input.required<Date | null>();
  readonly proxima = input.required<Date>();
  readonly ahora = input.required<Date>();

  protected readonly textoUltima = computed(() => {
    const ultima = this.ultima();
    return ultima ? describirMomento(ultima, this.ahora()) : null;
  });
  protected readonly textoProxima = computed(() => describirMomento(this.proxima(), this.ahora()));
}
