import type { RolUsuario } from './rol-usuario.type';

/** Usuario con sesión iniciada y su rol de gestión, si lo tiene. */
export interface SesionUsuario {
  readonly idUsuario: string;
  readonly email: string;
  readonly nombre: string | null;
  /** `null` si ha iniciado sesión pero el administrador aún no le ha dado permisos. */
  readonly rol: RolUsuario | null;
}
