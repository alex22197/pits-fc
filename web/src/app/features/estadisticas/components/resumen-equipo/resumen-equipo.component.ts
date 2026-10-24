import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import type { ResumenEquipo } from '@data-access/estadisticas/interfaces/resumen-equipo.interface';
import type { ResultadoPartido } from '@data-access/partidos/interfaces/resultado-partido.type';

const LETRAS: Readonly<Record<ResultadoPartido, string>> = {
  victoria: 'V',
  empate: 'E',
  derrota: 'D',
};

/** Las cifras de la temporada en fichas, la racha reciente y el balance en casa y fuera. */
@Component({
  selector: 'pits-resumen-equipo',
  templateUrl: './resumen-equipo.component.html',
  styleUrl: './resumen-equipo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenEquipoComponent {
  readonly resumen = input.required<ResumenEquipo>();
  readonly posicion = input.required<FilaClasificacion | null>();

  protected readonly racha = computed(() =>
    this.resumen().ultimos.map((resultado) => ({ resultado, letra: LETRAS[resultado] })),
  );

  protected readonly diferencia = computed(() => {
    const valor = this.resumen().diferencia;
    return valor > 0 ? `+${valor}` : String(valor);
  });
}
