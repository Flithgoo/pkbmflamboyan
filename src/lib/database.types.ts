export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      answer: {
        Row: {
          answer_text: string
          created_at: string
          id: number
          question_id: number
          score: string
          user_id: number
        }
        Insert: {
          answer_text: string
          created_at?: string
          id?: number
          question_id: number
          score: string
          user_id: number
        }
        Update: {
          answer_text?: string
          created_at?: string
          id?: number
          question_id?: number
          score?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "answer_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment: {
        Row: {
          created_at: string
          due_date: string
          id: number
          material_id: number
          title: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: number
          material_id: number
          title: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: number
          material_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_session_classes: {
        Row: {
          attendance_session_id: number
          class_id: number
          created_at: string
          id: number
        }
        Insert: {
          attendance_session_id: number
          class_id: number
          created_at?: string
          id?: number
        }
        Update: {
          attendance_session_id?: number
          class_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_session_classes_attendance_session_id_fkey"
            columns: ["attendance_session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_session_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          class_id: number | null
          created_at: string
          id: number
          location_id: number
          material_id: number
          reason: string | null
          session_end: string
          session_start: string
          user_id: number | null
        }
        Insert: {
          class_id?: number | null
          created_at?: string
          id?: number
          location_id: number
          material_id: number
          reason?: string | null
          session_end: string
          session_start: string
          user_id?: number | null
        }
        Update: {
          class_id?: number | null
          created_at?: string
          id?: number
          location_id?: number
          material_id?: number
          reason?: string | null
          session_end?: string
          session_start?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_tutor_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendances: {
        Row: {
          created_at: string
          id: number
          note: string | null
          session_id: number
          status: string | null
          updated_at: string
          updated_by: number | null
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          note?: string | null
          session_id: number
          status?: string | null
          updated_at?: string
          updated_by?: number | null
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          note?: string | null
          session_id?: number
          status?: string | null
          updated_at?: string
          updated_by?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendances_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      location: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      material_classes: {
        Row: {
          class_id: number
          created_at: string
          id: number
          material_id: number
        }
        Insert: {
          class_id: number
          created_at?: string
          id?: number
          material_id: number
        }
        Update: {
          class_id?: number
          created_at?: string
          id?: number
          material_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_class_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_class_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_location: {
        Row: {
          created_at: string
          id: number
          location_id: number | null
          material_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          location_id?: number | null
          material_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          location_id?: number | null
          material_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_location_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_location_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          content: string | null
          created_at: string
          file_url: string | null
          id: number
          subject_id: number
          title: string
          upload_type: string
          user_id: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: number
          subject_id: number
          title: string
          upload_type: string
          user_id: number
        }
        Update: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: number
          subject_id?: number
          title?: string
          upload_type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      question: {
        Row: {
          asignment_id: number | null
          created_at: string
          id: number
          question_text: string
          type: string
        }
        Insert: {
          asignment_id?: number | null
          created_at?: string
          id?: number
          question_text: string
          type: string
        }
        Update: {
          asignment_id?: number | null
          created_at?: string
          id?: number
          question_text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_asignment_id_fkey"
            columns: ["asignment_id"]
            isOneToOne: false
            referencedRelation: "assignment"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      tutor_subjects: {
        Row: {
          created_at: string
          id: number
          subject_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          subject_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          subject_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_class: {
        Row: {
          class_id: number
          id: number
          user_id: number
        }
        Insert: {
          class_id: number
          id?: number
          user_id: number
        }
        Update: {
          class_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_class_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_class_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_location: {
        Row: {
          created_at: string
          id: number
          location_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          location_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          location_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_location_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_location_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          name: string
          password: string
          profile_picture: string | null
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          password: string
          profile_picture?: string | null
          role: string
          username: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          password?: string
          profile_picture?: string | null
          role?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_material_with_attendance: {
        Args: {
          absensi_end?: string
          absensi_start?: string
          content: string
          is_absensi_enabled?: boolean
          jenis_upload: string
          kelas: Json
          mapel_id: number
          p_location_id: number
          title: string
          tutor_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
