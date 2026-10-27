import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TarjetaPartidoComponent } from '@shared/components/tarjeta-partido/tarjeta-partido.component';
import { AlineacionPartidoComponent } from '../../components/alineacion-partido/alineacion-partido.component';
import { ConvocatoriaPartidoComponent } from '@shared/components/convocatoria-partido/convocatoria-partido.component';
import { IncidenciasPartidoComponent } from '../../components/incidencias-partido/incidencias-partido.component';
import { DatosPartidoService } from '../../services/datos-partido.service';

/** Un partido nuestro con todo: marcador, goles, tarjetas, alineación y convocatoria. */
@Component({
  selector: 'pits-partido-page',
  imports: [
    RouterLink,
    MensajeEstadoComponent,
    TarjetaPartidoComponent,
    IncidenciasPartidoComponent,
    AlineacionPartidoComponent,
    ConvocatoriaPartidoComponent,
  ],
  providers: [DatosPartidoService],
  templateUrl: './partido-page.component.html',
  styleUrl: './partido-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartidoPageComponent {
  /** Viene de la ruta `calendario/partido/:idPartido`. */
  readonly idPartido = input.required<string>();

  protected readonly datos = inject(DatosPartidoService);

  constructor() {
    effect(() => this.datos.idPartido.set(this.idPartido()));
  }
}
