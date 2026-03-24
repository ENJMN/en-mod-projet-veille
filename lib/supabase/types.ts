export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          phone: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          country?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      formations: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          content: string | null;
          category: string;
          level: string;
          price_xof: number;
          price_eur: number | null;
          duration_hours: number;
          lessons_count: number;
          thumbnail_url: string | null;
          preview_video_url: string | null;
          instructor_name: string;
          instructor_bio: string | null;
          objectives: string[] | null;
          requirements: string[] | null;
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          content?: string | null;
          category: string;
          level?: string;
          price_xof?: number;
          price_eur?: number | null;
          duration_hours?: number;
          lessons_count?: number;
          thumbnail_url?: string | null;
          preview_video_url?: string | null;
          instructor_name?: string;
          instructor_bio?: string | null;
          objectives?: string[] | null;
          requirements?: string[] | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          category?: string;
          level?: string;
          price_xof?: number;
          price_eur?: number | null;
          duration_hours?: number;
          lessons_count?: number;
          thumbnail_url?: string | null;
          preview_video_url?: string | null;
          instructor_name?: string;
          instructor_bio?: string | null;
          objectives?: string[] | null;
          requirements?: string[] | null;
          is_published?: boolean;
          is_featured?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          formation_id: string;
          title: string;
          description: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          formation_id: string;
          title: string;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          position?: number;
        };
        Relationships: [];
      };
      lecons: {
        Row: {
          id: string;
          module_id: string;
          formation_id: string;
          title: string;
          type: string;
          video_url: string | null;
          content: string | null;
          duration_minutes: number;
          position: number;
          is_free_preview: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          formation_id: string;
          title: string;
          type?: string;
          video_url?: string | null;
          content?: string | null;
          duration_minutes?: number;
          position?: number;
          is_free_preview?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          type?: string;
          video_url?: string | null;
          content?: string | null;
          duration_minutes?: number;
          position?: number;
          is_free_preview?: boolean;
        };
        Relationships: [];
      };
      inscriptions: {
        Row: {
          id: string;
          user_id: string;
          formation_id: string;
          status: string;
          payment_status: string;
          payment_reference: string | null;
          amount_paid: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          formation_id: string;
          status?: string;
          payment_status?: string;
          payment_reference?: string | null;
          amount_paid?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          status?: string;
          payment_status?: string;
          payment_reference?: string | null;
          amount_paid?: number;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      progression: {
        Row: {
          id: string;
          user_id: string;
          lecon_id: string;
          formation_id: string;
          completed: boolean;
          watch_time_seconds: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lecon_id: string;
          formation_id: string;
          completed?: boolean;
          watch_time_seconds?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          completed?: boolean;
          watch_time_seconds?: number;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      certificats: {
        Row: {
          id: string;
          user_id: string;
          formation_id: string;
          certificate_number: string;
          issued_at: string;
          pdf_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          formation_id: string;
          certificate_number: string;
          issued_at?: string;
          pdf_url?: string | null;
        };
        Update: {
          pdf_url?: string | null;
        };
        Relationships: [];
      };
      temoignages: {
        Row: {
          id: string;
          prenom: string;
          role: string | null;
          entreprise: string | null;
          citation: string;
          is_published: boolean;
          ordre: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prenom: string;
          role?: string | null;
          entreprise?: string | null;
          citation: string;
          is_published?: boolean;
          ordre?: number;
          created_at?: string;
        };
        Update: {
          prenom?: string;
          role?: string | null;
          entreprise?: string | null;
          citation?: string;
          is_published?: boolean;
          ordre?: number;
        };
        Relationships: [];
      };
      partenaires: {
        Row: {
          id: string;
          nom: string;
          logo_url: string | null;
          site_url: string | null;
          is_published: boolean;
          ordre: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          logo_url?: string | null;
          site_url?: string | null;
          is_published?: boolean;
          ordre?: number;
          created_at?: string;
        };
        Update: {
          nom?: string;
          logo_url?: string | null;
          site_url?: string | null;
          is_published?: boolean;
          ordre?: number;
        };
        Relationships: [];
      };
      audit_leads: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          url: string;
          score: number | null;
          report: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          url: string;
          score?: number | null;
          report?: Json | null;
          created_at?: string;
        };
        Update: {
          score?: number | null;
          report?: Json | null;
        };
        Relationships: [];
      };
      terrains: {
        Row: {
          id: string;
          titre: string;
          zone: string;
          commune: string;
          localisation: string;
          surface: number;
          prix: number;
          prix_negociable: boolean;
          description: string | null;
          notes_libres: string | null;
          titre_propriete: string;
          type_zone: string;
          viabilisation: string[];
          caracteristiques: string[];
          images: string[];
          gps: string | null;
          disponible: boolean;
          statut: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          zone: string;
          commune: string;
          localisation: string;
          surface: number;
          prix: number;
          prix_negociable?: boolean;
          description?: string | null;
          notes_libres?: string | null;
          titre_propriete: string;
          type_zone: string;
          viabilisation?: string[];
          caracteristiques?: string[];
          images?: string[];
          gps?: string | null;
          disponible?: boolean;
          statut?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          titre?: string;
          zone?: string;
          commune?: string;
          localisation?: string;
          surface?: number;
          prix?: number;
          prix_negociable?: boolean;
          description?: string | null;
          notes_libres?: string | null;
          titre_propriete?: string;
          type_zone?: string;
          viabilisation?: string[];
          caracteristiques?: string[];
          images?: string[];
          gps?: string | null;
          disponible?: boolean;
          statut?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      formation_progress: {
        Row: {
          user_id: string | null;
          formation_id: string | null;
          formation_title: string | null;
          total_lessons: number | null;
          completed_lessons: number | null;
          progress_percent: number | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
