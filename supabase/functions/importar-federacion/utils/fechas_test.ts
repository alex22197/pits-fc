import { assertEquals } from '@std/assert';
import { fechaIso, horaNormalizada, hoyEnMadrid, instanteEnMadrid, sumarDias } from './fechas.ts';

Deno.test('fechaIso convierte el formato de la intranet', () => {
  assertEquals(fechaIso('(16-10-2026)'), '2026-10-16');
  assertEquals(fechaIso('sin fecha'), null);
});

Deno.test('horaNormalizada admite «h» y una cifra', () => {
  assertEquals(horaNormalizada('21:00 h'), '21:00');
  assertEquals(horaNormalizada(' 9:05'), '09:05');
  assertEquals(horaNormalizada(''), null);
});

Deno.test('instanteEnMadrid aplica el horario de verano y el de invierno', () => {
  assertEquals(instanteEnMadrid('2026-10-16', '21:00'), '2026-10-16T19:00:00.000Z');
  assertEquals(instanteEnMadrid('2026-11-06', '20:00'), '2026-11-06T19:00:00.000Z');
});

Deno.test('sumarDias cruza meses y años', () => {
  assertEquals(sumarDias('2026-12-30', 5), '2027-01-04');
  assertEquals(sumarDias('2027-01-02', -3), '2026-12-30');
});

Deno.test('hoyEnMadrid devuelve AAAA-MM-DD', () => {
  assertEquals(hoyEnMadrid(new Date('2026-10-24T23:30:00Z')), '2026-10-25');
});
