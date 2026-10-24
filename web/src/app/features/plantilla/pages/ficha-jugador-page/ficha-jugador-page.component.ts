import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { etiquetaPosicion } from '@data-access/jugadores/etiqueta-posicion';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TarjetaPartidoComponent } from '@shared/components/tarjeta-partido/tarjeta-partido.component';
import { DatosJugadorService } from '../../services/datos-jugador.service';

/** Ficha de un jugador: sus cifras de la temporada y los partidos que ha jugado. */
@Component({
  selector: 'pits-ficha-jugador-page',
  imports: [RouterLink, MensajeEstadoComponent, TarjetaPartidoComponent],
  providers: [DatosJugadorService],
  templateUrl: './ficha-jugador-page.component.html',
  styleUrl: './ficha-jugador-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FichaJugadorPageComponent {
  /** Viene de la ruta `jugadores/:idJugador`. */
  readonly idJugador = input.required<string>();

  protected readonly datos = inject(DatosJugadorService);
  protected readonly posicion = computed(() =>
    etiquetaPosicion(this.datos.jugador.value()?.posicion ?? null),
  );

  constructor() {
    effect(() => this.datos.idJugador.set(this.idJugador()));
  }
}
