import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EstadoConvocatoria } from '@data-access/convocatorias/interfaces/estado-convocatoria.type';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';
import { PortapapelesService } from '@shared/services/portapapeles.service';
import { DatosConvocatoriaGestionService } from '../../services/datos-convocatoria-gestion.service';

const OPCIONES: readonly { valor: EstadoConvocatoria | ''; etiqueta: string }[] = [
  { valor: '', etiqueta: 'Sin decidir' },
  { valor: 'convocado', etiqueta: 'Convocado' },
  { valor: 'duda', etiqueta: 'Duda' },
  { valor: 'descartado', etiqueta: 'No va' },
];

/** Preparar y publicar la convocatoria de un partido. */
@Component({
  selector: 'pits-convocatoria-gestion-page',
  imports: [RouterLink, MensajeEstadoComponent, FechaPartidoPipe],
  providers: [DatosConvocatoriaGestionService],
  templateUrl: './convocatoria-gestion-page.component.html',
  styleUrl: './convocatoria-gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaGestionPageComponent {
  protected readonly datos = inject(DatosConvocatoriaGestionService);
  private readonly portapapeles = inject(PortapapelesService);

  protected readonly opciones = OPCIONES;
  protected readonly copiado = signal<string | null>(null);

  protected elegirPartido(evento: Event): void {
    this.datos.elegirPartido((evento.target as HTMLSelectElement).value);
  }

  protected decidir(jugadorId: string, evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as EstadoConvocatoria | '';
    this.datos.decidir(jugadorId, valor === '' ? null : valor);
  }

  protected anotar(jugadorId: string, evento: Event): void {
    this.datos.anotar(jugadorId, (evento.target as HTMLInputElement).value);
  }

  protected async copiar(): Promise<void> {
    const ok = await this.portapapeles.copiar(this.datos.texto());
    this.copiado.set(
      ok
        ? 'Texto copiado. Pégalo en WhatsApp.'
        : 'No se ha podido copiar; selecciona el texto y cópialo a mano.',
    );
  }
}
