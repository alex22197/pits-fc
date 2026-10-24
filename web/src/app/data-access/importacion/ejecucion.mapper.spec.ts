import { describe, expect, it } from 'vitest';
import { mapearEjecucion } from './ejecucion.mapper';

describe('mapearEjecucion', () => {
  it('lee el resumen con cuidado', () => {
    const ejecucion = mapearEjecucion({
      id: 'e1',
      inicio: '2026-10-24T08:00:00+00:00',
      fin: '2026-10-24T08:00:20+00:00',
      estado: 'ok',
      resumen: {
        llamante: 'cron',
        partidosActualizados: 156,
        filasClasificacion: 13,
        actasImportadas: 2,
        jugadoresNuevos: ['Álvaro'],
        avisos: [],
        errores: [],
      },
      error: null,
    });
    expect(ejecucion.estado).toBe('ok');
    expect(ejecucion.llamante).toBe('cron');
    expect(ejecucion.partidosActualizados).toBe(156);
    expect(ejecucion.jugadoresNuevos).toEqual(['Álvaro']);
    expect(ejecucion.fin?.toISOString()).toBe('2026-10-24T08:00:20.000Z');
  });

  it('no se rompe con un resumen vacío o raro', () => {
    const ejecucion = mapearEjecucion({
      id: 'e2',
      inicio: '2026-10-24T08:00:00+00:00',
      fin: null,
      estado: null,
      resumen: 'basura',
      error: null,
    });
    expect(ejecucion.estado).toBeNull();
    expect(ejecucion.partidosActualizados).toBe(0);
    expect(ejecucion.errores).toEqual([]);
  });
});
