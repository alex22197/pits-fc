import { DOCUMENT, ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { ListaJornadaComponent } from '../../components/lista-jornada/lista-jornada.component';
import { DatosCalendarioService } from '../../services/datos-calendario.service';

/** Calendario de la liga por jornadas, abierto por la jornada que toca. */
@Component({
  selector: 'pits-calendario-page',
  imports: [MensajeEstadoComponent, ListaJornadaComponent],
  providers: [DatosCalendarioService],
  templateUrl: './calendario-page.component.html',
  styleUrl: './calendario-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioPageComponent {
  protected readonly datos = inject(DatosCalendarioService);
  private readonly documento = inject(DOCUMENT);
  private desplazado = false;

  constructor() {
    // La primera vez que hay datos, la página se coloca en la jornada que toca.
    effect(() => {
      const actual = this.datos.jornadaActual();
      if (!actual || this.desplazado) {
        return;
      }
      this.desplazado = true;
      setTimeout(() => {
        this.documento
          .getElementById(`jornada-${actual.numero}`)
          ?.scrollIntoView({ block: 'start' });
      });
    });
  }

  protected cambiarFiltro(evento: Event): void {
    this.datos.soloNuestros.set((evento.target as HTMLInputElement).checked);
  }
}
