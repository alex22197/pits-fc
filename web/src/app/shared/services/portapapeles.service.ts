import { Injectable } from '@angular/core';

/** Copia texto al portapapeles del navegador. Devuelve `false` si el navegador no deja. */
@Injectable({ providedIn: 'root' })
export class PortapapelesService {
  async copiar(texto: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      return false;
    }
  }
}
