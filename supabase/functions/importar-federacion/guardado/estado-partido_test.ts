import { assertEquals } from '@std/assert';
import { estadoDePartido } from './estado-partido.ts';

const HOY = '2026-10-24';

Deno.test('estadoDePartido: con marcador es jugado', () => {
  assertEquals(
    estadoDePartido({
      jugado: true,
      fechaHora: null,
      fechaPrevista: '2026-10-02',
      hoy: HOY,
      estadoActual: 'aplazado',
    }),
    'jugado',
  );
});

Deno.test('estadoDePartido: sin marcador y fecha pasada es aplazado', () => {
  assertEquals(
    estadoDePartido({
      jugado: false,
      fechaHora: null,
      fechaPrevista: '2026-10-02',
      hoy: HOY,
      estadoActual: 'programado',
    }),
    'aplazado',
  );
});

Deno.test('estadoDePartido: respeta el margen de dos días tras la fecha', () => {
  assertEquals(
    estadoDePartido({
      jugado: false,
      fechaHora: null,
      fechaPrevista: '2026-10-23',
      hoy: HOY,
      estadoActual: 'programado',
    }),
    'programado',
  );
  assertEquals(
    estadoDePartido({
      jugado: false,
      fechaHora: null,
      fechaPrevista: '2026-10-21',
      hoy: HOY,
      estadoActual: 'programado',
    }),
    'aplazado',
  );
});

Deno.test('estadoDePartido: una nueva fecha futura devuelve el partido a programado', () => {
  assertEquals(
    estadoDePartido({
      jugado: false,
      fechaHora: '2026-11-12T20:00:00.000Z',
      fechaPrevista: '2026-10-02',
      hoy: HOY,
      estadoActual: 'aplazado',
    }),
    'programado',
  );
});

Deno.test('estadoDePartido: suspendido se mantiene si no hay marcador', () => {
  assertEquals(
    estadoDePartido({
      jugado: false,
      fechaHora: null,
      fechaPrevista: '2026-11-06',
      hoy: HOY,
      estadoActual: 'suspendido',
    }),
    'suspendido',
  );
});
