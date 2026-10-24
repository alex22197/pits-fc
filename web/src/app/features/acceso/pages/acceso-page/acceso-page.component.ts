import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

/**
 * Entrar y salir de la cuenta de gestor. La web es pública: solo quien mete datos necesita
 * iniciar sesión, y tener cuenta no da permisos hasta que el administrador asigna el rol.
 */
@Component({
  selector: 'pits-acceso-page',
  templateUrl: './acceso-page.component.html',
  styleUrl: './acceso-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccesoPageComponent {
  protected readonly auth = inject(AuthService);
  protected readonly enCurso = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async entrar(): Promise<void> {
    await this.ejecutar(() => this.auth.iniciarSesionConGoogle());
  }

  protected async salir(): Promise<void> {
    await this.ejecutar(() => this.auth.cerrarSesion());
  }

  private async ejecutar(accion: () => Promise<void>): Promise<void> {
    this.enCurso.set(true);
    this.error.set(null);
    try {
      await accion();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Algo ha fallado. Prueba otra vez.');
    } finally {
      this.enCurso.set(false);
    }
  }
}
