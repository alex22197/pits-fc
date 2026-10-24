import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { ErrorAccesoDatos } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import type { RolUsuario } from './interfaces/rol-usuario.type';
import type { SesionUsuario } from './interfaces/sesion-usuario.interface';

/**
 * Sesión del usuario (login con Google) y su rol de gestión.
 *
 * La web es pública: iniciar sesión solo sirve para gestionar el equipo. Los permisos
 * reales los aplica la base de datos (RLS); este servicio solo adapta la interfaz.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseClientService).cliente;
  private readonly documento = inject(DOCUMENT);

  private readonly sesionActual = signal<SesionUsuario | null>(null);
  private readonly inicializada = signal(false);
  private readonly inicializacion: Promise<void>;

  readonly sesion = this.sesionActual.asReadonly();
  readonly lista = this.inicializada.asReadonly();
  readonly estaAutenticado = computed(() => this.sesionActual() !== null);
  readonly esGestor = computed(() => this.sesionActual()?.rol != null);
  readonly esAdmin = computed(() => this.sesionActual()?.rol === 'admin');

  constructor() {
    this.inicializacion = this.inicializar();
    this.supabase.auth.onAuthStateChange((evento, sesion) => {
      // Supabase desaconseja llamar a su API dentro de este callback: se difiere.
      setTimeout(() => void this.alCambiarSesion(evento, sesion));
    });
  }

  /** Resuelve cuando ya se sabe si hay sesión y qué rol tiene. */
  esperarInicializacion(): Promise<void> {
    return this.inicializacion;
  }

  async iniciarSesionConGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${this.documento.location.origin}/acceso` },
    });
    if (error) {
      throw new ErrorAccesoDatos('No se ha podido abrir el inicio de sesión de Google.', error);
    }
  }

  async cerrarSesion(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new ErrorAccesoDatos('No se ha podido cerrar la sesión.', error);
    }
    this.sesionActual.set(null);
  }

  private async inicializar(): Promise<void> {
    try {
      const { data } = await this.supabase.auth.getSession();
      await this.cargarSesion(data.session);
    } catch (error) {
      // Sin sesión legible, se entra como visitante; la web y sus guardas siguen respondiendo.
      console.warn('No se ha podido leer la sesión', error);
      this.sesionActual.set(null);
    } finally {
      this.inicializada.set(true);
    }
  }

  private async alCambiarSesion(evento: AuthChangeEvent, sesion: Session | null): Promise<void> {
    if (evento === 'SIGNED_OUT') {
      this.sesionActual.set(null);
    } else if (evento === 'SIGNED_IN' || evento === 'USER_UPDATED') {
      await this.cargarSesion(sesion);
    }
  }

  private async cargarSesion(sesion: Session | null): Promise<void> {
    if (!sesion) {
      this.sesionActual.set(null);
      return;
    }
    const { user } = sesion;
    const nombre = user.user_metadata['full_name'];
    this.sesionActual.set({
      idUsuario: user.id,
      email: user.email ?? '',
      nombre: typeof nombre === 'string' ? nombre : null,
      rol: await this.obtenerRol(user.id),
    });
  }

  private async obtenerRol(idUsuario: string): Promise<RolUsuario | null> {
    const { data, error } = await this.supabase
      .from('perfil')
      .select('rol')
      .eq('user_id', idUsuario)
      .maybeSingle();
    if (error) {
      console.warn('No se ha podido leer el rol del usuario', error);
      return null;
    }
    return data?.rol ?? null;
  }
}
