/**
 * Error de lectura o escritura en la base de datos, con un mensaje en castellano apto
 * para mostrar al usuario. El error original se conserva en `cause` para depurar.
 */
export class ErrorAccesoDatos extends Error {
  constructor(mensaje: string, causa?: unknown) {
    super(mensaje, { cause: causa });
    this.name = 'ErrorAccesoDatos';
  }
}

/** Lanza un `ErrorAccesoDatos` si la respuesta de Supabase trae error. */
export function lanzarSiHayError(error: unknown, mensaje: string): void {
  if (error) {
    throw new ErrorAccesoDatos(mensaje, error);
  }
}
