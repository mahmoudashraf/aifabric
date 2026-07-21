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
      bootcamp_enrollments: {
        Row: {
          bootcamp_id: string
          consented_at: string
          contact_email: string
          id: string
          joined_at: string
          phone_e164: string
          updated_at: string
          user_id: string
          whatsapp_consent: boolean
        }
        Insert: {
          bootcamp_id: string
          consented_at?: string
          contact_email: string
          id?: string
          joined_at?: string
          phone_e164: string
          updated_at?: string
          user_id?: string
          whatsapp_consent: boolean
        }
        Update: {
          bootcamp_id?: string
          consented_at?: string
          contact_email?: string
          id?: string
          joined_at?: string
          phone_e164?: string
          updated_at?: string
          user_id?: string
          whatsapp_consent?: boolean
        }
        Relationships: []
      }
      bootcamp_interest: {
        Row: {
          bootcamp_id: string
          consented_at: string
          contact_email: string
          email_consent: boolean
          id: string
          phone_e164: string | null
          registered_at: string
          updated_at: string
          user_id: string | null
          whatsapp_consent: boolean
        }
        Insert: {
          bootcamp_id: string
          consented_at?: string
          contact_email: string
          email_consent: boolean
          id?: string
          phone_e164?: string | null
          registered_at?: string
          updated_at?: string
          user_id?: string | null
          whatsapp_consent?: boolean
        }
        Update: {
          bootcamp_id?: string
          consented_at?: string
          contact_email?: string
          email_consent?: boolean
          id?: string
          phone_e164?: string | null
          registered_at?: string
          updated_at?: string
          user_id?: string | null
          whatsapp_consent?: boolean
        }
        Relationships: []
      }
      bootcamps: {
        Row: {
          benefits: CourseJson
          cohort_label: string
          created_at: string
          description: string
          id: string
          invitation_code_hash: string | null
          registration_mode: string
          slug: string
          starts_at: string | null
          status: string
          teaching_language: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: CourseJson
          cohort_label: string
          created_at?: string
          description: string
          id?: string
          invitation_code_hash?: string | null
          registration_mode: string
          slug: string
          starts_at?: string | null
          status: string
          teaching_language: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: CourseJson
          cohort_label?: string
          created_at?: string
          description?: string
          id?: string
          invitation_code_hash?: string | null
          registration_mode?: string
          slug?: string
          starts_at?: string | null
          status?: string
          teaching_language?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      get_my_bootcamp_enrollment: {
        Args: { p_bootcamp_slug: string }
        Returns: {
          bootcamp_id: string
          bootcamp_slug: string
          contact_email: string
          enrollment_id: string
          joined_at: string
          phone_e164: string
          whatsapp_consent: boolean
        }[]
      }
      list_bootcamps: {
        Args: Record<PropertyKey, never>
        Returns: {
          benefits: CourseJson
          cohort_label: string
          description: string
          enrolled: boolean
          id: string
          registration_mode: string
          slug: string
          starts_at: string | null
          status: string
          teaching_language: string
          title: string
        }[]
      }
      redeem_bootcamp_invitation: {
        Args: {
          p_bootcamp_slug: string
          p_invitation_code: string
          p_phone: string
          p_whatsapp_consent: boolean
        }
        Returns: {
          bootcamp_id: string
          bootcamp_slug: string
          contact_email: string
          enrollment_id: string
          joined_at: string
          phone_e164: string
          whatsapp_consent: boolean
        }[]
      }
      register_bootcamp_interest: {
        Args: {
          p_bootcamp_slug: string
          p_contact_email: string
          p_email_consent?: boolean
          p_phone?: string | null
          p_website?: string | null
          p_whatsapp_consent?: boolean
        }
        Returns: boolean
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

export type CourseTable<TableName extends keyof CourseDatabase["public"]["Tables"]> =
  CourseDatabase["public"]["Tables"][TableName]["Row"]
