import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { EditorJugadorComponent } from '../../components/editor-jugador/editor-jugador.component';
import { DatosJugadoresGestionService } from '../../services/datos-jugadores-gestion.service';

/** Gestión de la plantilla: un formulario por jugador. */
@Component({
  selector: 'pits-jugadores-gestion-page',
  imports: [RouterLink, MensajeEstadoComponent, EditorJugadorComponent],
  providers: [DatosJugadoresGestionService],
  templateUrl: './jugadores-gestion-page.component.html',
  styleUrl: './jugadores-gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JugadoresGestionPageComponent {
  protected readonly datos = inject(DatosJugadoresGestionService);
}
