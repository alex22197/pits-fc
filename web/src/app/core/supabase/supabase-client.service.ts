import { Injectable, inject } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENTORNO } from '@core/config/entorno.token';
import type { Database } from './interfaces/database.types';

/**
 * Única instancia del cliente de Supabase en toda la aplicación.
 *
 * Solo la usan los servicios de `src/app/data-access` y `core/auth`: ESLint impide
 * importarla desde páginas y componentes.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private readonly entorno = inject(ENTORNO);

  readonly cliente: SupabaseClient<Database> = createClient<Database>(
    this.entorno.supabase.url,
    this.entorno.supabase.publishableKey,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}
