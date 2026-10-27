import { ZONA_HORARIA } from '@core/config/sitio.constants';
import { formatearHora } from './formatear-fecha';
import { hoyEnMadrid } from './hoy';

const MS_DIA = 24 * 60 * 60 * 1000;
const RELATIVOS = new Map([
  [-1, 'ayer'],
  [0, 'hoy'],
  [1, 'mañana'],
]);

/**
 * Un momento contado respecto a `ahora`, en hora de Madrid: «hoy a las 09:00», «ayer a las
 * 09:00», «mañana a las 09:00» o «el martes 3 de noviembre a las 09:00».
 */
export function describirMomento(fecha: Date, ahora: Date): string {
  const hora = `a las ${formatearHora(fecha)}`;
  const relativo = RELATIVOS.get(diasEntre(hoyEnMadrid(ahora), hoyEnMadrid(fecha)));
  if (relativo) return `${relativo} ${hora}`;
  const dia = new Intl.DateTimeFormat('es-ES', {
    timeZone: ZONA_HORARIA,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
    .format(fecha)
    .replace(',', '');
  return `el ${dia} ${hora}`;
}

/** Días de calendario de `desde` a `hasta`, ambos `AAAA-MM-DD`. */
function diasEntre(desde: string, hasta: string): number {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / MS_DIA);
}
