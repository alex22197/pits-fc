import type { CodigosCompeticion } from '../interfaces/codigos-competicion.interface.ts';
import { decodificar } from './codificacion.ts';
import { urlLogin } from './urls.ts';

/**
 * Sesión con la intranet de la delegación (Novanet): inicia sesión una vez y descarga
 * páginas con la cookie. Solo lee; nunca envía formularios de la intranet aparte del login.
 *
 * Las credenciales llegan por variables de entorno y no se registran jamás.
 */
export class ClienteIntranet {
  private cookies = '';

  constructor(
    private readonly base: string,
    private readonly usuario: string,
    private readonly clave: string,
  ) {}

  static desdeEntorno(): ClienteIntranet {
    const usuario = Deno.env.get('FEDERACION_USUARIO');
    const clave = Deno.env.get('FEDERACION_CLAVE');
    if (!usuario || !clave) {
      throw new Error('Faltan los secretos FEDERACION_USUARIO y FEDERACION_CLAVE.');
    }
    return new ClienteIntranet(
      Deno.env.get('FEDERACION_BASE') ?? 'https://alcobendas.ffmadrid.es',
      usuario,
      clave,
    );
  }

  /** Inicia sesión y guarda la cookie. Falla si la intranet devuelve otra vez el login. */
  async iniciarSesion(): Promise<void> {
    const primera = await fetch(this.base + '/nfg/', { redirect: 'manual' });
    this.recogerCookies(primera);
    await primera.body?.cancel();

    const cuerpo = new URLSearchParams({ NUser: this.usuario, NPass: this.clave, NURL: '' });
    const respuesta = await fetch(this.base + urlLogin(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: this.cookies,
      },
      body: cuerpo,
      redirect: 'manual',
    });
    this.recogerCookies(respuesta);
    const html = await leerHtml(respuesta);
    if (respuesta.status >= 400 || esPaginaDeLogin(html)) {
      throw new Error('La intranet ha rechazado el inicio de sesión.');
    }
  }

  /** Descarga una página de la intranet con la sesión abierta. */
  async descargar(rutaConParametros: string): Promise<string> {
    const respuesta = await fetch(this.base + rutaConParametros, {
      headers: { Cookie: this.cookies },
      redirect: 'manual',
    });
    this.recogerCookies(respuesta);
    const html = await leerHtml(respuesta);
    if (respuesta.status >= 400) {
      throw new Error(`La intranet ha respondido ${respuesta.status} a ${rutaConParametros}`);
    }
    if (esPaginaDeLogin(html)) {
      throw new Error('La sesión con la intranet se ha perdido.');
    }
    return html;
  }

  private recogerCookies(respuesta: Response): void {
    const nuevas = respuesta.headers
      .getSetCookie()
      .map((cookie) => cookie.split(';')[0])
      .filter((cookie) => cookie.length > 0);
    if (nuevas.length > 0) {
      this.cookies = nuevas.join('; ');
    }
  }
}

/** Cuerpo de la respuesta como texto, con la codificación que declara (ISO-8859-1). */
async function leerHtml(respuesta: Response): Promise<string> {
  return decodificar(await respuesta.arrayBuffer(), respuesta.headers.get('content-type'));
}

/** La intranet no devuelve 401: cuando no hay sesión, sirve la página de login con 200. */
export function esPaginaDeLogin(html: string): boolean {
  return /name="NLogin"|id="NUser"/.test(html);
}

/** Códigos de la competición tal como los guarda la base de datos. */
export function codigosDesde(fila: {
  cod_competicion: string;
  cod_grupo: string;
  cod_temporada: string;
}): CodigosCompeticion {
  return {
    competicion: fila.cod_competicion,
    grupo: fila.cod_grupo,
    temporada: fila.cod_temporada,
  };
}
