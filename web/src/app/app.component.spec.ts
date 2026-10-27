import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '@core/auth/auth.service';
import { ImportacionService } from '@data-access/importacion/importacion.service';
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
        {
          provide: ImportacionService,
          useValue: {
            obtenerUltimaImportacion: () => Promise.resolve(new Date('2026-10-27T08:00:40Z')),
          },
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

  it('avisa en el pie de la última actualización y de la próxima', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const aviso = (fixture.nativeElement as HTMLElement).querySelector('pits-aviso-actualizacion');
    expect(aviso?.textContent).toContain('Datos actualizados');
    expect(aviso?.textContent).toContain('a las 09:00');
    expect(aviso?.textContent).toContain('Próxima actualización');
  });
});
