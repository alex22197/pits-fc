import { assertEquals } from '@std/assert';
import { nombreCorto } from './nombre-corto.ts';

Deno.test('nombreCorto usa el primer nombre con mayúscula inicial', () => {
  assertEquals(nombreCorto('GARCÍA LÓPEZ, ÁLVARO', new Set()), 'Álvaro');
  assertEquals(nombreCorto('DIEZ BOTO, RAUL', new Set()), 'Raul');
  assertEquals(nombreCorto('MOGOLLON GUANOCHANGA, JYMMY JHOEL', new Set()), 'Jymmy');
});

Deno.test('nombreCorto añade la inicial o el apellido si el nombre ya existe', () => {
  assertEquals(nombreCorto('GUTIERREZ SALADO, SAMUEL', new Set(['Samuel'])), 'Samuel G.');
  assertEquals(
    nombreCorto('GUTIERREZ SALADO, SAMUEL', new Set(['Samuel', 'Samuel G.'])),
    'Samuel Gutierrez',
  );
  assertEquals(
    nombreCorto('GUTIERREZ SALADO, SAMUEL', new Set(['Samuel', 'Samuel G.', 'Samuel Gutierrez'])),
    'Samuel 2',
  );
});

Deno.test('nombreCorto no se rompe con nombres sin coma', () => {
  assertEquals(nombreCorto('PABLO', new Set()), 'Pablo');
  assertEquals(nombreCorto('', new Set()), 'Jugador');
});
