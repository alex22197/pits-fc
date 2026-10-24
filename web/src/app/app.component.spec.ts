import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '@core/auth/auth.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { estaAutenticado: () => false, esGestor: () => false },
        },
      ],
    }).compileComponents();
  });

  it('muestra la cabecera con el nombre del equipo', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelector('pits-cabecera-sitio')?.textContent).toContain('PITS FC');
  });
});
