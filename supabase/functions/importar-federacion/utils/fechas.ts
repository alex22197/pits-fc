const ZONA_HORARIA = 'Europe/Madrid';

/** `16-10-2026` (como escribe la intranet) → `2026-10-16`. `null` si no tiene esa forma. */
export function fechaIso(texto: string): string | null {
  const coincidencia = /(\d{2})-(\d{2})-(\d{4})/.exec(texto);
  if (!coincidencia) {
    return null;
  }
  const [, dia, mes, anio] = coincidencia;
  return `${anio}-${mes}-${dia}`;
}

/** `21:00` o `21:00 h` → `21:00`. `null` si no hay hora. */
export function horaNormalizada(texto: string): string | null {
  const coincidencia = /(\d{1,2}):(\d{2})/.exec(texto);
  return coincidencia ? `${coincidencia[1].padStart(2, '0')}:${coincidencia[2]}` : null;
}

/**
 * Fecha `AAAA-MM-DD` y hora `HH:MM` en hora de Madrid → instante ISO en UTC, teniendo en
 * cuenta el horario de verano. Se calcula con `Intl`, que conoce las reglas de la zona.
 */
export function instanteEnMadrid(fecha: string, hora: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  const deseado = Date.UTC(anio, mes - 1, dia, horas, minutos);
  // Primera aproximación: como si Madrid fuera UTC; se corrige con el desfase real dos veces
  // por si la primera corrección cruza un cambio de hora.
  let instante = deseado;
  for (let vuelta = 0; vuelta < 2; vuelta++) {
    instante -= enMadrid(instante) - deseado;
  }
  return new Date(instante).toISOString();
}

/** Qué hora marca un reloj de Madrid en ese instante, expresada como milisegundos UTC. */
function enMadrid(instante: number): number {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(instante));
  const valor = (tipo: string): number => Number(partes.find((p) => p.type === tipo)?.value);
  return Date.UTC(valor('year'), valor('month') - 1, valor('day'), valor('hour'), valor('minute'));
}

/** Hoy en Madrid como `AAAA-MM-DD`. */
export function hoyEnMadrid(ahora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ahora);
}

/** Suma días a una fecha `AAAA-MM-DD`. */
export function sumarDias(fecha: string, dias: number): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10);
}
