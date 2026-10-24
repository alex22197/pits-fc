import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, type RouterStateSnapshot } from '@angular/router';
import { NOMBRE_SITIO } from '@core/config/sitio.constants';

/** Pone en la pestaña «Título de la ruta | PITS FC». */
@Injectable({ providedIn: 'root' })
export class TituloPaginaStrategy extends TitleStrategy {
  private readonly titulo = inject(Title);

  override updateTitle(estado: RouterStateSnapshot): void {
    const tituloRuta = this.buildTitle(estado);
    this.titulo.setTitle(tituloRuta ? `${tituloRuta} | ${NOMBRE_SITIO}` : NOMBRE_SITIO);
  }
}
