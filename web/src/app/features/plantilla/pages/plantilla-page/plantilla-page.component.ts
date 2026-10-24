import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TarjetaJugadorComponent } from '../../components/tarjeta-jugador/tarjeta-jugador.component';
import { DatosPlantillaService } from '../../services/datos-plantilla.service';

/** Plantilla del equipo: un jugador por tarjeta, con enlace a su ficha. */
@Component({
  selector: 'pits-plantilla-page',
  imports: [MensajeEstadoComponent, TarjetaJugadorComponent],
  providers: [DatosPlantillaService],
  templateUrl: './plantilla-page.component.html',
  styleUrl: './plantilla-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantillaPageComponent {
  protected readonly datos = inject(DatosPlantillaService);
}
