export type CourseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: CourseJson | undefined }
  | CourseJson[]

export type CourseDatabase = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      course_certificate_requests: {
        Row: {
          capstone_commit: string
          capstone_url: string
          certificate_id: string | null
          contact_email: string
          course_version: string
          decision_message: string | null
          display_name: string
          id: string
          issued_at: string | null
          profile_url: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          capstone_commit: string
          capstone_url: string
          certificate_id?: string | null
          contact_email: string
          course_version: string
          decision_message?: string | null
          display_name: string
          id?: string
          issued_at?: string | null
          profile_url?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Update: {
          capstone_commit?: string
          capstone_url?: string
          certificate_id?: string | null
          contact_email?: string
          course_version?: string
          decision_message?: string | null
          display_name?: string
          id?: string
          issued_at?: string | null
          profile_url?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed_at: string | null
          course_version: string
          lesson_id: string
          question_answers: CourseJson
          question_score: number | null
          questions_answered: number
          questions_submitted_at: string | null
          updated_at: string
          user_id: string
          video_completed_at: string | null
        }
        Insert: {
          completed_at?: string | null
          course_version: string
          lesson_id: string
          question_answers?: CourseJson
          question_score?: number | null
          questions_answered?: number
          questions_submitted_at?: string | null
          updated_at?: string
          user_id?: string
          video_completed_at?: string | null
        }
        Update: {
          completed_at?: string | null
          course_version?: string
          lesson_id?: string
          question_answers?: CourseJson
          question_score?: number | null
          questions_answered?: number
          questions_submitted_at?: string | null
          updated_at?: string
          user_id?: string
          video_completed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type CourseTable<TableName extends keyof CourseDatabase["public"]["Tables"]> =
  CourseDatabase["public"]["Tables"][TableName]["Row"]
