/** Forma de la configuración de cada entorno (desarrollo y producción). */
export interface Entorno {
  readonly produccion: boolean;
  readonly supabase: {
    readonly url: string;
    /** Clave pública del proyecto: lo que protege los datos son las políticas RLS. */
    readonly publishableKey: string;
  };
}
