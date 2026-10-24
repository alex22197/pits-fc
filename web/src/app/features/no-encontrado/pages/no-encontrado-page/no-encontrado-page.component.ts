import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página para las direcciones que no existen. */
@Component({
  selector: 'pits-no-encontrado-page',
  imports: [RouterLink],
  templateUrl: './no-encontrado-page.component.html',
  styleUrl: './no-encontrado-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoEncontradoPageComponent {}
