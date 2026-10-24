import { ZONA_HORARIA } from '@core/config/sitio.constants';

const IDIOMA = 'es-ES';

/** `Date` → «vie 16 oct · 21:00», en hora de Madrid. */
export function formatearFechaHora(fecha: Date): string {
  return `${formatearDia(fecha)} · ${formatearHora(fecha)}`;
}

/** `Date` → «viernes 16 de octubre, 21:00», en hora de Madrid. */
export function formatearFechaHoraLarga(fecha: Date): string {
  const dia = new Intl.DateTimeFormat(IDIOMA, {
    timeZone: ZONA_HORARIA,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fecha);
  return `${dia}, ${formatearHora(fecha)}`;
}

/** `Date` → «vie 16 oct». */
export function formatearDia(fecha: Date): string {
  return limpiar(
    new Intl.DateTimeFormat(IDIOMA, {
      timeZone: ZONA_HORARIA,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(fecha),
  );
}

/** `Date` → «21:00». */
export function formatearHora(fecha: Date): string {
  return new Intl.DateTimeFormat(IDIOMA, {
    timeZone: ZONA_HORARIA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(fecha);
}

/** Fecha del calendario `AAAA-MM-DD` → «vie 23 oct», sin que la zona horaria la mueva de día. */
export function formatearFechaPrevista(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return limpiar(
    new Intl.DateTimeFormat(IDIOMA, {
      timeZone: 'UTC',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(Date.UTC(anio, mes - 1, dia))),
  );
}

/** Quita los puntos de las abreviaturas («vie., 16 oct.» → «vie 16 oct») y la coma. */
function limpiar(texto: string): string {
  return texto.replace(/\./g, '').replace(/,/g, '').replace(/\s+/g, ' ').trim();
}
