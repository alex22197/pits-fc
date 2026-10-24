import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

/** Índice de la zona de gestión: qué puede hacer un gestor. */
@Component({
  selector: 'pits-gestion-page',
  imports: [RouterLink],
  templateUrl: './gestion-page.component.html',
  styleUrl: './gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionPageComponent {
  protected readonly auth = inject(AuthService);
}
