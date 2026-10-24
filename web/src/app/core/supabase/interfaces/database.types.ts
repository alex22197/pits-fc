// Tipos de la base de datos. Se regeneran con `npm run db:tipos` en la raíz del repositorio;
// no se editan a mano. Esta versión está escrita a partir de las migraciones hasta que el
// proyecto de Supabase esté enlazado y se pueda generar.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Enums_ = {
  rol_usuario: 'admin' | 'gestor';
  estado_partido: 'programado' | 'jugado' | 'aplazado' | 'suspendido';
  posicion_jugador: 'portero' | 'defensa' | 'centrocampista' | 'delantero';
  tipo_tarjeta: 'amarilla' | 'roja';
  estado_convocatoria: 'convocado' | 'duda' | 'descartado';
  estado_ejecucion: 'ok' | 'error';
};

type Relacion = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Tabla<Fila, Insercion, Relaciones extends Relacion[] = []> = {
  Row: Fila;
  Insert: Insercion;
  Update: Partial<Insercion>;
  Relationships: Relaciones;
};

type Auditada = { created_at: string; updated_at: string };
type AuditadaOpcional = { created_at?: string; updated_at?: string };

export type Database = {
  public: {
    Tables: {
      perfil: Tabla<
        { user_id: string; rol: Enums_['rol_usuario']; created_at: string },
        { user_id: string; rol: Enums_['rol_usuario']; created_at?: string }
      >;
      competicion: Tabla<
        {
          id: string;
          nombre: string;
          temporada: string;
          grupo: string;
          cod_competicion: string;
          cod_grupo: string;
          cod_temporada: string;
          activa: boolean;
        } & Auditada,
        {
          id?: string;
          nombre: string;
          temporada: string;
          grupo: string;
          cod_competicion: string;
          cod_grupo: string;
          cod_temporada: string;
          activa?: boolean;
        } & AuditadaOpcional
      >;
      equipo: Tabla<
        {
          id: string;
          nombre: string;
          nombre_federacion: string;
          cod_equipo: string | null;
          es_nuestro: boolean;
        } & Auditada,
        {
          id?: string;
          nombre: string;
          nombre_federacion: string;
          cod_equipo?: string | null;
          es_nuestro?: boolean;
        } & AuditadaOpcional
      >;
      jornada: Tabla<
        {
          id: string;
          competicion_id: string;
          numero: number;
          vuelta: number;
          fecha_prevista: string;
          descansa_id: string | null;
        } & Auditada,
        {
          id?: string;
          competicion_id: string;
          numero: number;
          vuelta: number;
          fecha_prevista: string;
          descansa_id?: string | null;
        } & AuditadaOpcional,
        [
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
        ]
      >;
      partido: Tabla<
        {
          id: string;
          jornada_id: string;
          local_id: string;
          visitante_id: string;
          fecha_hora: string | null;
          campo: string | null;
          estado: Enums_['estado_partido'];
          goles_local: number | null;
          goles_visitante: number | null;
          cod_acta: string | null;
          acta_importada_en: string | null;
          convocatoria_publicada: boolean;
        } & Auditada,
        {
          id?: string;
          jornada_id: string;
          local_id: string;
          visitante_id: string;
          fecha_hora?: string | null;
          campo?: string | null;
          estado?: Enums_['estado_partido'];
          goles_local?: number | null;
          goles_visitante?: number | null;
          cod_acta?: string | null;
          acta_importada_en?: string | null;
          convocatoria_publicada?: boolean;
        } & AuditadaOpcional,
        [
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
        ]
      >;
      clasificacion: Tabla<
        {
          competicion_id: string;
          equipo_id: string;
          posicion: number;
          puntos: number;
          jugados: number;
          ganados: number;
          empatados: number;
          perdidos: number;
          goles_favor: number;
          goles_contra: number;
          sancion: number;
          ultimos: string;
          actualizado_en: string;
        },
        {
          competicion_id: string;
          equipo_id: string;
          posicion: number;
          puntos?: number;
          jugados?: number;
          ganados?: number;
          empatados?: number;
          perdidos?: number;
          goles_favor?: number;
          goles_contra?: number;
          sancion?: number;
          ultimos?: string;
          actualizado_en?: string;
        },
        [
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
        ]
      >;
      jugador: Tabla<
        {
          id: string;
          nombre_mostrar: string;
          dorsal: number | null;
          posicion: Enums_['posicion_jugador'] | null;
          activo: boolean;
        } & Auditada,
        {
          id?: string;
          nombre_mostrar: string;
          dorsal?: number | null;
          posicion?: Enums_['posicion_jugador'] | null;
          activo?: boolean;
        } & AuditadaOpcional
      >;
      jugador_privado: Tabla<
        { jugador_id: string; nombre_federacion: string | null; updated_at: string },
        { jugador_id: string; nombre_federacion?: string | null; updated_at?: string },
        [
          {
            foreignKeyName: 'jugador_privado_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: true;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ]
      >;
      participacion: Tabla<
        {
          partido_id: string;
          jugador_id: string;
          titular: boolean;
          dorsal: number | null;
          created_at: string;
        },
        {
          partido_id: string;
          jugador_id: string;
          titular?: boolean;
          dorsal?: number | null;
          created_at?: string;
        },
        [
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ]
      >;
      gol: Tabla<
        {
          id: string;
          partido_id: string;
          equipo_id: string;
          jugador_id: string | null;
          minuto: number | null;
          marcador_local: number;
          marcador_visitante: number;
          created_at: string;
        },
        {
          id?: string;
          partido_id: string;
          equipo_id: string;
          jugador_id?: string | null;
          minuto?: number | null;
          marcador_local: number;
          marcador_visitante: number;
          created_at?: string;
        },
        [
          {
            foreignKeyName: 'gol_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
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
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ]
      >;
      tarjeta: Tabla<
        {
          id: string;
          partido_id: string;
          jugador_id: string;
          tipo: Enums_['tipo_tarjeta'];
          minuto: number | null;
          created_at: string;
        },
        {
          id?: string;
          partido_id: string;
          jugador_id: string;
          tipo: Enums_['tipo_tarjeta'];
          minuto?: number | null;
          created_at?: string;
        },
        [
          {
            foreignKeyName: 'tarjeta_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tarjeta_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ]
      >;
      convocatoria: Tabla<
        {
          partido_id: string;
          jugador_id: string;
          estado: Enums_['estado_convocatoria'];
          nota: string | null;
        } & Auditada,
        {
          partido_id: string;
          jugador_id: string;
          estado?: Enums_['estado_convocatoria'];
          nota?: string | null;
        } & AuditadaOpcional,
        [
          {
            foreignKeyName: 'convocatoria_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'convocatoria_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ]
      >;
      ejecucion_scraper: Tabla<
        {
          id: string;
          inicio: string;
          fin: string | null;
          estado: Enums_['estado_ejecucion'] | null;
          resumen: Json | null;
          error: string | null;
        },
        {
          id?: string;
          inicio?: string;
          fin?: string | null;
          estado?: Enums_['estado_ejecucion'] | null;
          resumen?: Json | null;
          error?: string | null;
        }
      >;
    };
    Views: {
      estadisticas_jugador: {
        Row: {
          jugador_id: string;
          nombre_mostrar: string;
          dorsal: number | null;
          posicion: Enums_['posicion_jugador'] | null;
          activo: boolean;
          partidos: number;
          titularidades: number;
          goles: number;
          amarillas: number;
          rojas: number;
          goles_encajados: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      es_gestor: { Args: Record<string, never>; Returns: boolean };
      id_equipo: { Args: { nombre_en_federacion: string }; Returns: string | null };
    };
    Enums: Enums_;
    CompositeTypes: Record<never, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
