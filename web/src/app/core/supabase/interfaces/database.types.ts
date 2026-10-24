// Tipos de la base de datos. Se regeneran con `npm run db:tipos` en la raíz del repositorio;
// no se editan a mano. Esta primera versión refleja la migración `esquema_inicial` hasta que
// el proyecto de Supabase esté enlazado.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      perfil: {
        Row: {
          user_id: string;
          rol: Database['public']['Enums']['rol_usuario'];
          created_at: string;
        };
        Insert: {
          user_id: string;
          rol: Database['public']['Enums']['rol_usuario'];
          created_at?: string;
        };
        Update: {
          user_id?: string;
          rol?: Database['public']['Enums']['rol_usuario'];
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      rol_usuario: 'admin' | 'gestor';
    };
    CompositeTypes: Record<never, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
