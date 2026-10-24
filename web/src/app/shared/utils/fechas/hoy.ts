import { ZONA_HORARIA } from '@core/config/sitio.constants';

/** Hoy en Madrid como `AAAA-MM-DD`, comparable con las fechas previstas del calendario. */
export function hoyEnMadrid(ahora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ahora);
}
