/**
 * Nombre corto para mostrar en público a partir del nombre completo de la federación
 * («APELLIDO UNO APELLIDO DOS, NOMBRE SEGUNDO»): el primer nombre con mayúscula inicial y, si
 * ya lo usa otro jugador, la inicial del primer apellido o el apellido entero (ADR 0004).
 * Alex puede cambiarlo después desde gestión.
 */
export function nombreCorto(nombreFederacion: string, existentes: ReadonlySet<string>): string {
  const [apellidos = '', nombres = ''] = nombreFederacion.split(',').map((parte) => parte.trim());
  const nombre = capitalizar(nombres.split(/\s+/)[0] || apellidos.split(/\s+/)[0] || 'Jugador');
  const apellido = capitalizar(apellidos.split(/\s+/)[0] ?? '');
  const candidatos = [
    nombre,
    apellido ? `${nombre} ${apellido.charAt(0)}.` : nombre,
    apellido ? `${nombre} ${apellido}` : nombre,
  ];
  for (const candidato of candidatos) {
    if (!existentes.has(candidato)) {
      return candidato;
    }
  }
  let numero = 2;
  while (existentes.has(`${nombre} ${numero}`)) {
    numero += 1;
  }
  return `${nombre} ${numero}`;
}

/** «ÁLVARO» → «Álvaro»; respeta tildes y eñes. */
export function capitalizar(palabra: string): string {
  const minusculas = palabra.toLocaleLowerCase('es');
  return minusculas.charAt(0).toLocaleUpperCase('es') + minusculas.slice(1);
}
