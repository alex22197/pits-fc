export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      clasificacion: {
        Row: {
          actualizado_en: string;
          competicion_id: string;
          empatados: number;
          equipo_id: string;
          ganados: number;
          goles_contra: number;
          goles_favor: number;
          jugados: number;
          perdidos: number;
          posicion: number;
          puntos: number;
          sancion: number;
          ultimos: string;
        };
        Insert: {
          actualizado_en?: string;
          competicion_id: string;
          empatados?: number;
          equipo_id: string;
          ganados?: number;
          goles_contra?: number;
          goles_favor?: number;
          jugados?: number;
          perdidos?: number;
          posicion: number;
          puntos?: number;
          sancion?: number;
          ultimos?: string;
        };
        Update: {
          actualizado_en?: string;
          competicion_id?: string;
          empatados?: number;
          equipo_id?: string;
          ganados?: number;
          goles_contra?: number;
          goles_favor?: number;
          jugados?: number;
          perdidos?: number;
          posicion?: number;
          puntos?: number;
          sancion?: number;
          ultimos?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'clasificacion_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'clasificacion_equipo_id_fkey';
            columns: ['equipo_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
        ];
      };
      competicion: {
        Row: {
          activa: boolean;
          cod_competicion: string;
          cod_grupo: string;
          cod_temporada: string;
          created_at: string;
          grupo: string;
          id: string;
          nombre: string;
          temporada: string;
          updated_at: string;
        };
        Insert: {
          activa?: boolean;
          cod_competicion: string;
          cod_grupo: string;
          cod_temporada: string;
          created_at?: string;
          grupo: string;
          id?: string;
          nombre: string;
          temporada: string;
          updated_at?: string;
        };
        Update: {
          activa?: boolean;
          cod_competicion?: string;
          cod_grupo?: string;
          cod_temporada?: string;
          created_at?: string;
          grupo?: string;
          id?: string;
          nombre?: string;
          temporada?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      convocatoria: {
        Row: {
          created_at: string;
          estado: Database['public']['Enums']['estado_convocatoria'];
          jugador_id: string;
          nota: string | null;
          partido_id: string;
          puesto: Database['public']['Enums']['puesto_alineacion'] | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          estado?: Database['public']['Enums']['estado_convocatoria'];
          jugador_id: string;
          nota?: string | null;
          partido_id: string;
          puesto?: Database['public']['Enums']['puesto_alineacion'] | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          estado?: Database['public']['Enums']['estado_convocatoria'];
          jugador_id?: string;
          nota?: string | null;
          partido_id?: string;
          puesto?: Database['public']['Enums']['puesto_alineacion'] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'convocatoria_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'convocatoria_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'convocatoria_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
      ejecucion_scraper: {
        Row: {
          error: string | null;
          estado: Database['public']['Enums']['estado_ejecucion'] | null;
          fin: string | null;
          id: string;
          inicio: string;
          resumen: Json | null;
        };
        Insert: {
          error?: string | null;
          estado?: Database['public']['Enums']['estado_ejecucion'] | null;
          fin?: string | null;
          id?: string;
          inicio?: string;
          resumen?: Json | null;
        };
        Update: {
          error?: string | null;
          estado?: Database['public']['Enums']['estado_ejecucion'] | null;
          fin?: string | null;
          id?: string;
          inicio?: string;
          resumen?: Json | null;
        };
        Relationships: [];
      };
      equipo: {
        Row: {
          cod_equipo: string | null;
          created_at: string;
          es_nuestro: boolean;
          id: string;
          nombre: string;
          nombre_federacion: string;
          updated_at: string;
        };
        Insert: {
          cod_equipo?: string | null;
          created_at?: string;
          es_nuestro?: boolean;
          id?: string;
          nombre: string;
          nombre_federacion: string;
          updated_at?: string;
        };
        Update: {
          cod_equipo?: string | null;
          created_at?: string;
          es_nuestro?: boolean;
          id?: string;
          nombre?: string;
          nombre_federacion?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gol: {
        Row: {
          asistente_id: string | null;
          created_at: string;
          equipo_id: string;
          id: string;
          jugador_id: string | null;
          marcador_local: number;
          marcador_visitante: number;
          minuto: number | null;
          partido_id: string;
        };
        Insert: {
          asistente_id?: string | null;
          created_at?: string;
          equipo_id: string;
          id?: string;
          jugador_id?: string | null;
          marcador_local: number;
          marcador_visitante: number;
          minuto?: number | null;
          partido_id: string;
        };
        Update: {
          asistente_id?: string | null;
          created_at?: string;
          equipo_id?: string;
          id?: string;
          jugador_id?: string | null;
          marcador_local?: number;
          marcador_visitante?: number;
          minuto?: number | null;
          partido_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gol_asistente_id_fkey';
            columns: ['asistente_id'];
            isOneToOne: false;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'gol_asistente_id_fkey';
            columns: ['asistente_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'gol_equipo_id_fkey';
            columns: ['equipo_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'gol_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'gol_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'gol_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
      jornada: {
        Row: {
          competicion_id: string;
          created_at: string;
          descansa_id: string | null;
          fecha_prevista: string;
          id: string;
          numero: number;
          updated_at: string;
          vuelta: number;
        };
        Insert: {
          competicion_id: string;
          created_at?: string;
          descansa_id?: string | null;
          fecha_prevista: string;
          id?: string;
          numero: number;
          updated_at?: string;
          vuelta: number;
        };
        Update: {
          competicion_id?: string;
          created_at?: string;
          descansa_id?: string | null;
          fecha_prevista?: string;
          id?: string;
          numero?: number;
          updated_at?: string;
          vuelta?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'jornada_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'jornada_descansa_id_fkey';
            columns: ['descansa_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
        ];
      };
      jugador: {
        Row: {
          activo: boolean;
          created_at: string;
          dorsal: number | null;
          id: string;
          nombre_mostrar: string;
          posicion: Database['public']['Enums']['posicion_jugador'] | null;
          updated_at: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          dorsal?: number | null;
          id?: string;
          nombre_mostrar: string;
          posicion?: Database['public']['Enums']['posicion_jugador'] | null;
          updated_at?: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          dorsal?: number | null;
          id?: string;
          nombre_mostrar?: string;
          posicion?: Database['public']['Enums']['posicion_jugador'] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      jugador_privado: {
        Row: {
          jugador_id: string;
          nombre_federacion: string | null;
          updated_at: string;
        };
        Insert: {
          jugador_id: string;
          nombre_federacion?: string | null;
          updated_at?: string;
        };
        Update: {
          jugador_id?: string;
          nombre_federacion?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'jugador_privado_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: true;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'jugador_privado_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: true;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      participacion: {
        Row: {
          created_at: string;
          dorsal: number | null;
          jugador_id: string;
          partido_id: string;
          puesto: Database['public']['Enums']['puesto_alineacion'] | null;
          titular: boolean;
        };
        Insert: {
          created_at?: string;
          dorsal?: number | null;
          jugador_id: string;
          partido_id: string;
          puesto?: Database['public']['Enums']['puesto_alineacion'] | null;
          titular?: boolean;
        };
        Update: {
          created_at?: string;
          dorsal?: number | null;
          jugador_id?: string;
          partido_id?: string;
          puesto?: Database['public']['Enums']['puesto_alineacion'] | null;
          titular?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
      partido: {
        Row: {
          acta_importada_en: string | null;
          campo: string | null;
          cod_acta: string | null;
          convocatoria_publicada: boolean;
          created_at: string;
          estado: Database['public']['Enums']['estado_partido'];
          fecha_hora: string | null;
          goles_local: number | null;
          goles_visitante: number | null;
          id: string;
          jornada_id: string;
          local_id: string;
          updated_at: string;
          visitante_id: string;
        };
        Insert: {
          acta_importada_en?: string | null;
          campo?: string | null;
          cod_acta?: string | null;
          convocatoria_publicada?: boolean;
          created_at?: string;
          estado?: Database['public']['Enums']['estado_partido'];
          fecha_hora?: string | null;
          goles_local?: number | null;
          goles_visitante?: number | null;
          id?: string;
          jornada_id: string;
          local_id: string;
          updated_at?: string;
          visitante_id: string;
        };
        Update: {
          acta_importada_en?: string | null;
          campo?: string | null;
          cod_acta?: string | null;
          convocatoria_publicada?: boolean;
          created_at?: string;
          estado?: Database['public']['Enums']['estado_partido'];
          fecha_hora?: string | null;
          goles_local?: number | null;
          goles_visitante?: number | null;
          id?: string;
          jornada_id?: string;
          local_id?: string;
          updated_at?: string;
          visitante_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'partido_jornada_id_fkey';
            columns: ['jornada_id'];
            isOneToOne: false;
            referencedRelation: 'jornada';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'partido_local_id_fkey';
            columns: ['local_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'partido_visitante_id_fkey';
            columns: ['visitante_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
        ];
      };
      perfil: {
        Row: {
          created_at: string;
          rol: Database['public']['Enums']['rol_usuario'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          rol: Database['public']['Enums']['rol_usuario'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          rol?: Database['public']['Enums']['rol_usuario'];
          user_id?: string;
        };
        Relationships: [];
      };
      tarjeta: {
        Row: {
          created_at: string;
          id: string;
          jugador_id: string;
          minuto: number | null;
          partido_id: string;
          tipo: Database['public']['Enums']['tipo_tarjeta'];
        };
        Insert: {
          created_at?: string;
          id?: string;
          jugador_id: string;
          minuto?: number | null;
          partido_id: string;
          tipo: Database['public']['Enums']['tipo_tarjeta'];
        };
        Update: {
          created_at?: string;
          id?: string;
          jugador_id?: string;
          minuto?: number | null;
          partido_id?: string;
          tipo?: Database['public']['Enums']['tipo_tarjeta'];
        };
        Relationships: [
          {
            foreignKeyName: 'tarjeta_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'estadisticas_jugador';
            referencedColumns: ['jugador_id'];
          },
          {
            foreignKeyName: 'tarjeta_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tarjeta_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      estadisticas_jugador: {
        Row: {
          activo: boolean | null;
          amarillas: number | null;
          asistencias: number | null;
          dorsal: number | null;
          goles: number | null;
          goles_encajados: number | null;
          jugador_id: string | null;
          nombre_mostrar: string | null;
          partidos: number | null;
          posicion: Database['public']['Enums']['posicion_jugador'] | null;
          rojas: number | null;
          titularidades: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      es_gestor: { Args: never; Returns: boolean };
      es_partido_nuestro: { Args: { id_partido: string }; Returns: boolean };
      id_equipo: { Args: { nombre_en_federacion: string }; Returns: string };
      ultima_importacion: { Args: never; Returns: string };
    };
    Enums: {
      estado_convocatoria: 'convocado' | 'duda' | 'descartado';
      estado_ejecucion: 'ok' | 'error';
      estado_partido: 'programado' | 'jugado' | 'aplazado' | 'suspendido';
      posicion_jugador: 'portero' | 'defensa' | 'centrocampista' | 'delantero';
      puesto_alineacion:
        | 'portero'
        | 'central_izquierdo'
        | 'central_derecho'
        | 'lateral_izquierdo'
        | 'medio'
        | 'lateral_derecho'
        | 'delantero';
      rol_usuario: 'admin' | 'gestor';
      tipo_tarjeta: 'amarilla' | 'roja';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      estado_convocatoria: ['convocado', 'duda', 'descartado'],
      estado_ejecucion: ['ok', 'error'],
      estado_partido: ['programado', 'jugado', 'aplazado', 'suspendido'],
      posicion_jugador: ['portero', 'defensa', 'centrocampista', 'delantero'],
      puesto_alineacion: [
        'portero',
        'central_izquierdo',
        'central_derecho',
        'lateral_izquierdo',
        'medio',
        'lateral_derecho',
        'delantero',
      ],
      rol_usuario: ['admin', 'gestor'],
      tipo_tarjeta: ['amarilla', 'roja'],
    },
  },
} as const;
