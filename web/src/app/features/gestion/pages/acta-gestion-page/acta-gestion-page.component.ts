import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TipoTarjeta } from '@data-access/partidos/interfaces/tipo-tarjeta.type';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';
import { DatosActaGestionService } from '../../services/datos-acta-gestion.service';

/** Apuntar los goles, las asistencias y las tarjetas de un partido ya jugado. */
@Component({
  selector: 'pits-acta-gestion-page',
  imports: [RouterLink, MensajeEstadoComponent, FechaPartidoPipe],
  providers: [DatosActaGestionService],
  templateUrl: './acta-gestion-page.component.html',
  styleUrl: './acta-gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActaGestionPageComponent {
  protected readonly datos = inject(DatosActaGestionService);

  protected elegirPartido(evento: Event): void {
    this.datos.elegirPartido((evento.target as HTMLSelectElement).value);
  }

  protected minutoDe(evento: Event): number | null {
    const valor = (evento.target as HTMLInputElement).value.trim();
    return valor === '' ? null : Number(valor);
  }

  protected idDe(evento: Event): string | null {
    const valor = (evento.target as HTMLSelectElement).value;
    return valor === '' ? null : valor;
  }

  protected equipoDe(evento: Event): boolean {
    return (evento.target as HTMLSelectElement).value === 'nuestro';
  }

  protected tipoDe(evento: Event): TipoTarjeta {
    return (evento.target as HTMLSelectElement).value as TipoTarjeta;
  }

  protected jugadorDe(evento: Event): string {
    return (evento.target as HTMLSelectElement).value;
  }
}
