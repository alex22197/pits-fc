import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EstadisticasJugador } from '@data-access/estadisticas/interfaces/estadisticas-jugador.interface';
import { etiquetaPosicion } from '@data-access/jugadores/etiqueta-posicion';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';

/** Un jugador en la plantilla: dorsal, nombre, posición y sus cifras, con enlace a su ficha. */
@Component({
  selector: 'pits-tarjeta-jugador',
  imports: [RouterLink],
  templateUrl: './tarjeta-jugador.component.html',
  styleUrl: './tarjeta-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaJugadorComponent {
  readonly jugador = input.required<Jugador>();
  readonly cifras = input<EstadisticasJugador | null>(null);

  protected readonly posicion = computed(() => etiquetaPosicion(this.jugador().posicion));
  protected readonly resumen = computed(() => {
    const cifras = this.cifras();
    if (!cifras || cifras.partidos === 0) {
      return 'Sin partidos todavía';
    }
    const partidos = `${cifras.partidos} ${cifras.partidos === 1 ? 'partido' : 'partidos'}`;
    const goles = `${cifras.goles} ${cifras.goles === 1 ? 'gol' : 'goles'}`;
    return `${partidos} · ${goles}`;
  });
}
