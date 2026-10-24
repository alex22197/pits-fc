import { TestBed } from '@angular/core/testing';
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { gestorGuard } from './gestor.guard';

function configurar(esGestor: boolean): void {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: AuthService,
        useValue: {
          esperarInicializacion: () => Promise.resolve(),
          esGestor: () => esGestor,
        },
      },
    ],
  });
}

async function ejecutarGuard(): Promise<unknown> {
  return TestBed.runInInjectionContext(() =>
    gestorGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('gestorGuard', () => {
  it('deja pasar a un gestor', async () => {
    configurar(true);
    expect(await ejecutarGuard()).toBe(true);
  });

  it('lleva a /acceso a quien no es gestor', async () => {
    configurar(false);
    const router = TestBed.inject(Router);
    const crearUrl = vi.spyOn(router, 'createUrlTree');
    await ejecutarGuard();
    expect(crearUrl).toHaveBeenCalledWith(['/acceso']);
  });
});
