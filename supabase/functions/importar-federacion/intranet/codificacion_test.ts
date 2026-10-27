import { assertEquals } from '@std/assert';
import { codificacionDe, decodificar } from './codificacion.ts';

Deno.test('codificacionDe lee el charset del Content-Type y asume latin-1 si falta', () => {
  assertEquals(codificacionDe('text/html;charset=ISO-8859-1'), 'windows-1252');
  assertEquals(codificacionDe('text/html; charset="utf-8"'), 'utf-8');
  assertEquals(codificacionDe('text/html'), 'windows-1252');
  assertEquals(codificacionDe(null), 'windows-1252');
});

Deno.test('decodificar recupera tildes y eñes de una página en latin-1', () => {
  // «Álvaro Muñoz» en ISO-8859-1: Á = 0xC1, ñ = 0xF1.
  const bytes = new Uint8Array([
    0xc1,
    0x6c,
    0x76,
    0x61,
    0x72,
    0x6f,
    0x20,
    0x4d,
    0x75,
    0xf1,
    0x6f,
    0x7a,
  ]);
  assertEquals(decodificar(bytes.buffer, 'text/html;charset=ISO-8859-1'), 'Álvaro Muñoz');
});

Deno.test('decodificar respeta utf-8 cuando la respuesta lo declara', () => {
  const bytes = new TextEncoder().encode('Últimos');
  assertEquals(decodificar(bytes.buffer, 'text/html; charset=utf-8'), 'Últimos');
});
