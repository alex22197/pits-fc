/** Nombre que aparece en el título de la pestaña del navegador. */
export const NOMBRE_SITIO = 'PITS FC';

/** Zona horaria en la que se juegan los partidos y se muestran las fechas. */
export const ZONA_HORARIA = 'Europe/Madrid';

/** Dirección pública de la web (Cloudflare Pages). */
export const URL_SITIO = 'https://pits-fc.pages.dev';

/** Responsable de los datos personales de la web: sale en la página de privacidad. */
export const RESPONSABLE_DATOS = {
  nombre: 'Alejandro García Olmeda',
  correo: 'alejandrogarciaolmeda@gmail.com',
} as const;

/** Última vez que cambió la política de privacidad. */
export const FECHA_PRIVACIDAD = '27 de octubre de 2026';

/** Competición y temporada que se muestran mientras no haya varias en la base de datos. */
export const COMPETICION_ACTUAL = {
  nombre: 'Ayto. Alcobendas Fútbol 7',
  grupo: '2ª Aficionados G2',
  temporada: '2026-2027',
} as const;
