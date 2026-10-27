import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { DetallePartido } from '@data-access/partidos/interfaces/detalle-partido.interface';
import type { Incidencia } from './interfaces/incidencia.interface';

/** Goles y tarjetas del partido en orden de minuto, con el marcador que dejó cada gol. */
@Component({
  selector: 'pits-incidencias-partido',
  templateUrl: './incidencias-partido.component.html',
  styleUrl: './incidencias-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidenciasPartidoComponent {
  readonly detalle = input.required<DetallePartido>();

  protected readonly incidencias = computed<Incidencia[]>(() => {
    const { partido, goles, tarjetas } = this.detalle();
    const lista: Incidencia[] = [
      ...goles.map((gol): Incidencia => ({
        tipo: 'gol',
        minuto: gol.minuto,
        nuestro:
          gol.equipoId === (partido.local.esNuestro ? partido.local.id : partido.visitante.id),
        quien: gol.jugador?.nombreMostrar ?? nombreRival(partido),
        marcador: `${gol.marcador.local}-${gol.marcador.visitante}`,
      })),
      ...tarjetas.map((tarjeta): Incidencia => ({
        tipo: tarjeta.tipo,
        minuto: tarjeta.minuto,
        nuestro: true,
        quien: tarjeta.jugador.nombreMostrar,
        marcador: null,
      })),
    ];
    return lista.sort((a, b) => (a.minuto ?? Infinity) - (b.minuto ?? Infinity));
  });
}

function nombreRival(partido: DetallePartido['partido']): string {
  return partido.local.esNuestro ? partido.visitante.nombre : partido.local.nombre;
}
