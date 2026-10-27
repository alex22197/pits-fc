import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FECHA_PRIVACIDAD, RESPONSABLE_DATOS } from '@core/config/sitio.constants';

/**
 * Política de privacidad: qué datos guarda la web, de dónde salen, para qué se usan y a quién
 * pedir que se cambien o se borren. Google la exige para entrar con su cuenta (ADR 0004).
 */
@Component({
  selector: 'pits-privacidad-page',
  imports: [RouterLink],
  templateUrl: './privacidad-page.component.html',
  styleUrl: './privacidad-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacidadPageComponent {
  protected readonly responsable = RESPONSABLE_DATOS;
  protected readonly fecha = FECHA_PRIVACIDAD;
}
