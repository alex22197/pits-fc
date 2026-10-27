import { Pipe, type PipeTransform } from '@angular/core';
import type { Partido } from '@data-access/partidos/interfaces/partido.interface';
import {
  formatearFechaHora,
  formatearFechaHoraLarga,
  formatearFechaPrevista,
} from '@shared/utils/fechas/formatear-fecha';

/**
 * Cuándo se juega un partido: la fecha y hora reales si la federación ya las ha fijado y, si
 * no, el día previsto del calendario con «hora por fijar».
 */
@Pipe({ name: 'fechaPartido' })
export class FechaPartidoPipe implements PipeTransform {
  transform(partido: Partido, formato: 'corta' | 'larga' = 'corta'): string {
    if (partido.fechaHora) {
      return formato === 'larga'
        ? formatearFechaHoraLarga(partido.fechaHora)
        : formatearFechaHora(partido.fechaHora);
    }
    return `${formatearFechaPrevista(partido.fechaPrevista)} · hora por fijar`;
  }
}
