/**
 * Cuándo se lanza sola la importación: los martes a las 8:00 UTC (9:00 o 10:00 en Madrid,
 * según el horario de invierno o de verano). Es el `schedule` del cron `importar-federacion`
 * (`supabase/migrations/20261024170000_scraper_en_paris.sql`): si cambia allí, cambia aquí.
 */
export const PROGRAMACION_IMPORTACION = { diaSemanaUtc: 2, horaUtc: 8 } as const;

const MS_DIA = 24 * 60 * 60 * 1000;

/** La próxima importación automática estrictamente después de `ahora`. */
export function calcularProximaImportacion(ahora: Date): Date {
  const { diaSemanaUtc, horaUtc } = PROGRAMACION_IMPORTACION;
  const hoy = Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate(), horaUtc);
  const diasHastaElDia = (diaSemanaUtc - ahora.getUTCDay() + 7) % 7;
  const candidata = hoy + diasHastaElDia * MS_DIA;
  return new Date(candidata > ahora.getTime() ? candidata : candidata + 7 * MS_DIA);
}
