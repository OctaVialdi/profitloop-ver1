export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidate_applications: {
        Row: {
          address: string | null
          birth_date: string | null
          birth_place: string | null
          blood_type: string | null
          citizen_address: string | null
          created_at: string
          email: string
          full_name: string
          gender: string | null
          id: string
          job_position_id: string | null
          marital_status: string | null
          nik: string | null
          organization_id: string
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          position: string | null
          postal_code: string | null
          recruitment_link_id: string
          religion: string | null
          score: number | null
          status: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_type?: string | null
          citizen_address?: string | null
          created_at?: string
          email: string
          full_name: string
          gender?: string | null
          id?: string
          job_position_id?: string | null
          marital_status?: string | null
          nik?: string | null
          organization_id: string
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          position?: string | null
          postal_code?: string | null
          recruitment_link_id: string
          religion?: string | null
          score?: number | null
          status?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_type?: string | null
          citizen_address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          job_position_id?: string | null
          marital_status?: string | null
          nik?: string | null
          organization_id?: string
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          position?: string | null
          postal_code?: string | null
          recruitment_link_id?: string
          religion?: string | null
          score?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_applications_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_evaluations: {
        Row: {
          average_score: number
          candidate_id: string
          comments: string | null
          communication: number | null
          created_at: string
          criteria_scores: Json | null
          cultural_fit: number | null
          evaluator_id: string | null
          experience_relevance: number | null
          id: string
          overall_impression: number | null
          technical_skills: number | null
          updated_at: string
        }
        Insert: {
          average_score: number
          candidate_id: string
          comments?: string | null
          communication?: number | null
          created_at?: string
          criteria_scores?: Json | null
          cultural_fit?: number | null
          evaluator_id?: string | null
          experience_relevance?: number | null
          id?: string
          overall_impression?: number | null
          technical_skills?: number | null
          updated_at?: string
        }
        Update: {
          average_score?: number
          candidate_id?: string
          comments?: string | null
          communication?: number | null
          created_at?: string
          criteria_scores?: Json | null
          cultural_fit?: number | null
          evaluator_id?: string | null
          experience_relevance?: number | null
          id?: string
          overall_impression?: number | null
          technical_skills?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_evaluations_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_family_members: {
        Row: {
          address: string | null
          age: number | null
          candidate_application_id: string
          gender: string | null
          id: string
          is_emergency_contact: boolean | null
          name: string
          occupation: string | null
          phone: string | null
          relationship: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          candidate_application_id: string
          gender?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          name: string
          occupation?: string | null
          phone?: string | null
          relationship?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          candidate_application_id?: string
          gender?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          name?: string
          occupation?: string | null
          phone?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_family_members_candidate_application_id_fkey"
            columns: ["candidate_application_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_formal_education: {
        Row: {
          candidate_application_id: string
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string
          grade: string | null
          id: string
          institution_name: string
          start_date: string | null
        }
        Insert: {
          candidate_application_id: string
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study: string
          grade?: string | null
          id?: string
          institution_name: string
          start_date?: string | null
        }
        Update: {
          candidate_application_id?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string
          grade?: string | null
          id?: string
          institution_name?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_formal_education_candidate_application_id_fkey"
            columns: ["candidate_application_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_informal_education: {
        Row: {
          candidate_application_id: string
          certificate_number: string | null
          certification_field: string
          course_name: string
          description: string | null
          end_date: string | null
          id: string
          provider: string
          start_date: string | null
        }
        Insert: {
          candidate_application_id: string
          certificate_number?: string | null
          certification_field: string
          course_name: string
          description?: string | null
          end_date?: string | null
          id?: string
          provider: string
          start_date?: string | null
        }
        Update: {
          candidate_application_id?: string
          certificate_number?: string | null
          certification_field?: string
          course_name?: string
          description?: string | null
          end_date?: string | null
          id?: string
          provider?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_informal_education_candidate_application_id_fkey"
            columns: ["candidate_application_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_interview_notes: {
        Row: {
          candidate_id: string
          content: string | null
          created_at: string | null
          created_by: string
          id: string
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          content?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_interview_notes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_status_options: {
        Row: {
          created_at: string | null
          id: string
          is_system: boolean
          label: string
          organization_id: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_system?: boolean
          label: string
          organization_id: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_system?: boolean
          label?: string
          organization_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_status_options_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_work_experience: {
        Row: {
          candidate_application_id: string
          company_name: string
          end_date: string | null
          id: string
          job_description: string | null
          location: string | null
          position: string
          start_date: string | null
        }
        Insert: {
          candidate_application_id: string
          company_name: string
          end_date?: string | null
          id?: string
          job_description?: string | null
          location?: string | null
          position: string
          start_date?: string | null
        }
        Update: {
          candidate_application_id?: string
          company_name?: string
          end_date?: string | null
          id?: string
          job_description?: string | null
          location?: string | null
          position?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_work_experience_candidate_application_id_fkey"
            columns: ["candidate_application_id"]
            isOneToOne: false
            referencedRelation: "candidate_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborations: {
        Row: {
          created_at: string | null
          id: string
          invited_org_id: string
          inviting_org_id: string
          message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_org_id: string
          inviting_org_id: string
          message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_org_id?: string
          inviting_org_id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_invited_org_id_fkey"
            columns: ["invited_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_inviting_org_id_fkey"
            columns: ["inviting_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          employee_id: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          name: string
          organization_id: string
          signed: boolean
          status: string
          tags: string[] | null
          updated_at: string
          upload_date: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          employee_id?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          name: string
          organization_id: string
          signed?: boolean
          status?: string
          tags?: string[] | null
          updated_at?: string
          upload_date?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          employee_id?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          name?: string
          organization_id?: string
          signed?: boolean
          status?: string
          tags?: string[] | null
          updated_at?: string
          upload_date?: string
          version?: string | null
        }
        Relationships: []
      }
      company_goals: {
        Row: {
          created_at: string
          created_by: string | null
          current_progress: number | null
          deadline: string | null
          description: string | null
          icon: string | null
          id: string
          is_critical: boolean | null
          name: string
          organization_id: string
          status: string | null
          target_amount: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_progress?: number | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_critical?: boolean | null
          name: string
          organization_id: string
          status?: string | null
          target_amount: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_progress?: number | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_critical?: boolean | null
          name?: string
          organization_id?: string
          status?: string | null
          target_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_mission_vision: {
        Row: {
          created_at: string
          id: string
          mission: string | null
          organization_id: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mission?: string | null
          organization_id: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mission?: string | null
          organization_id?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_mission_vision_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          employees: number | null
          established: string | null
          id: string
          logo_url: string | null
          organization_id: string
          phone: string | null
          tax_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          employees?: number | null
          established?: string | null
          id?: string
          logo_url?: string | null
          organization_id: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          employees?: number | null
          established?: string | null
          id?: string
          logo_url?: string | null
          organization_id?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_values: {
        Row: {
          created_at: string
          id: string
          order_index: number
          organization_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          organization_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          organization_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_metrics: {
        Row: {
          category: string | null
          created_at: string
          customer_id: string | null
          feedback_text: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number | null
          organization_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          customer_id?: string | null
          feedback_text?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value?: number | null
          organization_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          customer_id?: string | null
          feedback_text?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_calon_kandidat: {
        Row: {
          address: string | null
          application_date: string
          birth_date: string | null
          created_at: string
          education: string | null
          email: string
          experience: string | null
          full_name: string
          has_been_contacted: boolean | null
          id: string
          interview_date: string | null
          interview_notes: string | null
          job_position_id: string | null
          organization_id: string
          phone: string | null
          recruiter_comments: string | null
          resume_url: string | null
          score: number | null
          status: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          address?: string | null
          application_date?: string
          birth_date?: string | null
          created_at?: string
          education?: string | null
          email: string
          experience?: string | null
          full_name: string
          has_been_contacted?: boolean | null
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          job_position_id?: string | null
          organization_id: string
          phone?: string | null
          recruiter_comments?: string | null
          resume_url?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          address?: string | null
          application_date?: string
          birth_date?: string | null
          created_at?: string
          education?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          has_been_contacted?: boolean | null
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          job_position_id?: string | null
          organization_id?: string
          phone?: string | null
          recruiter_comments?: string | null
          resume_url?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_calon_kandidat_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_calon_kandidat_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_assets: {
        Row: {
          asset_image: string | null
          asset_tag: string | null
          asset_type: string
          assigned_date: string | null
          brand: string | null
          condition: string | null
          created_at: string
          employee_id: string
          expected_return_date: string | null
          id: string
          model: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          specifications: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_image?: string | null
          asset_tag?: string | null
          asset_type: string
          assigned_date?: string | null
          brand?: string | null
          condition?: string | null
          created_at?: string
          employee_id: string
          expected_return_date?: string | null
          id?: string
          model?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          specifications?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_image?: string | null
          asset_tag?: string | null
          asset_type?: string
          assigned_date?: string | null
          brand?: string | null
          condition?: string | null
          created_at?: string
          employee_id?: string
          expected_return_date?: string | null
          id?: string
          model?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          specifications?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_assets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_employment: {
        Row: {
          barcode: string | null
          branch: string | null
          company_name: string | null
          created_at: string
          employee_id: string
          employment_status: string | null
          id: string
          job_level: string | null
          job_position: string | null
          join_date: string | null
          organization_name: string | null
          sign_date: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          branch?: string | null
          company_name?: string | null
          created_at?: string
          employee_id: string
          employment_status?: string | null
          id?: string
          job_level?: string | null
          job_position?: string | null
          join_date?: string | null
          organization_name?: string | null
          sign_date?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          branch?: string | null
          company_name?: string | null
          created_at?: string
          employee_id?: string
          employment_status?: string | null
          id?: string
          job_level?: string | null
          job_position?: string | null
          join_date?: string | null
          organization_name?: string | null
          sign_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_employment_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_family_members: {
        Row: {
          address: string | null
          age: number | null
          created_at: string
          employee_id: string
          gender: string | null
          id: string
          is_emergency_contact: boolean | null
          name: string
          occupation: string | null
          phone: string | null
          relationship: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          created_at?: string
          employee_id: string
          gender?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          name: string
          occupation?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          created_at?: string
          employee_id?: string
          gender?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          name?: string
          occupation?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_family_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_files: {
        Row: {
          created_at: string | null
          description: string | null
          employee_id: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          name: string
          status: string | null
          tags: string[] | null
          updated_at: string | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employee_id: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          name: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employee_id?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          name?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_files_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_formal_education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          employee_id: string
          end_date: string | null
          field_of_study: string
          grade: string | null
          id: string
          institution_name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          employee_id: string
          end_date?: string | null
          field_of_study: string
          grade?: string | null
          id?: string
          institution_name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          employee_id?: string
          end_date?: string | null
          field_of_study?: string
          grade?: string | null
          id?: string
          institution_name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_formal_education_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_informal_education: {
        Row: {
          certificate_number: string | null
          certification_field: string
          course_name: string
          created_at: string
          description: string | null
          employee_id: string
          end_date: string | null
          id: string
          provider: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          certificate_number?: string | null
          certification_field: string
          course_name: string
          created_at?: string
          description?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          provider: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          certificate_number?: string | null
          certification_field?: string
          course_name?: string
          created_at?: string
          description?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          provider?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_informal_education_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_working_experience: {
        Row: {
          company_name: string
          created_at: string
          employee_id: string
          end_date: string | null
          id: string
          job_description: string | null
          location: string | null
          position: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          employee_id: string
          end_date?: string | null
          id?: string
          job_description?: string | null
          location?: string | null
          position: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          employee_id?: string
          end_date?: string | null
          id?: string
          job_description?: string | null
          location?: string | null
          position?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_working_experience_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          birth_date: string | null
          birth_place: string | null
          blood_type: string | null
          citizen_address: string | null
          created_at: string
          email: string | null
          employee_id: string | null
          gender: string | null
          id: string
          marital_status: string | null
          mobile_phone: string | null
          name: string
          nik: string | null
          organization_id: string
          passport_expiry: string | null
          passport_number: string | null
          postal_code: string | null
          profile_image: string | null
          religion: string | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_type?: string | null
          citizen_address?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          mobile_phone?: string | null
          name: string
          nik?: string | null
          organization_id: string
          passport_expiry?: string | null
          passport_number?: string | null
          postal_code?: string | null
          profile_image?: string | null
          religion?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_type?: string | null
          citizen_address?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          mobile_phone?: string | null
          name?: string
          nik?: string | null
          organization_id?: string
          passport_expiry?: string | null
          passport_number?: string | null
          postal_code?: string | null
          profile_image?: string | null
          religion?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      evaluation_criteria: {
        Row: {
          category_id: string
          created_at: string | null
          display_order: number
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          display_order: number
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_criteria_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "evaluation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_metrics: {
        Row: {
          created_at: string
          details: string | null
          employee_id: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number | null
          organization_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          employee_id?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value?: number | null
          organization_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          employee_id?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "innovation_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          due_date: string
          id: string
          invoice_number: string
          invoice_pdf_url: string | null
          organization_id: string
          payment_details: Json | null
          status: string
          subscription_plan_id: string | null
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          due_date: string
          id?: string
          invoice_number: string
          invoice_pdf_url?: string | null
          organization_id: string
          payment_details?: Json | null
          status: string
          subscription_plan_id?: string | null
          tax_amount?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_pdf_url?: string | null
          organization_id?: string
          payment_details?: Json | null
          status?: string
          subscription_plan_id?: string | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_positions: {
        Row: {
          created_at: string
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          organization_id: string
          requirements: string | null
          responsibilities: string | null
          salary_range: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          organization_id: string
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          organization_id?: string
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_positions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_points: {
        Row: {
          created_at: string
          date: string
          discussion_point: string
          id: string
          organization_id: string | null
          request_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          discussion_point: string
          id?: string
          organization_id?: string | null
          request_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          discussion_point?: string
          id?: string
          organization_id?: string | null
          request_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_points_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_updates: {
        Row: {
          created_at: string
          date: string
          id: string
          meeting_point_id: string
          person: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          meeting_point_id: string
          person: string
          status: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          meeting_point_id?: string
          person?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_updates_meeting_point_id_fkey"
            columns: ["meeting_point_id"]
            isOneToOne: false
            referencedRelation: "meeting_points"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          organization_id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          organization_id: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          organization_id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_metrics: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          organization_id: string
          period: string | null
          period_end: string | null
          period_start: string | null
          target_value: number | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          organization_id: string
          period?: string | null
          period_end?: string | null
          period_start?: string | null
          target_value?: number | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          organization_id?: string
          period?: string | null
          period_end?: string | null
          period_start?: string | null
          target_value?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          node_id: string
          user_id: string
        }
        Insert: {
          node_id: string
          user_id: string
        }
        Update: {
          node_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "org_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_structure: {
        Row: {
          color_hex: string | null
          created_at: string | null
          id: string
          name: string
          order_index: number | null
          organization_id: string
          parent_id: string | null
          profile_pic_url: string | null
          role: string | null
          type: string | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          id?: string
          name: string
          order_index?: number | null
          organization_id: string
          parent_id?: string | null
          profile_pic_url?: string | null
          role?: string | null
          type?: string | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number | null
          organization_id?: string
          parent_id?: string | null
          profile_pic_url?: string | null
          role?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_structure_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_structure_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "org_structure"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          business_field: string | null
          created_at: string | null
          creator_email: string | null
          employee_count: number | null
          grace_period_end: string | null
          id: string
          logo_path: string | null
          name: string
          phone: string | null
          subscription_plan_id: string | null
          subscription_status: string | null
          theme_settings: Json | null
          trial_end_date: string | null
          trial_expired: boolean | null
          trial_start_date: string | null
        }
        Insert: {
          address?: string | null
          business_field?: string | null
          created_at?: string | null
          creator_email?: string | null
          employee_count?: number | null
          grace_period_end?: string | null
          id?: string
          logo_path?: string | null
          name: string
          phone?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          theme_settings?: Json | null
          trial_end_date?: string | null
          trial_expired?: boolean | null
          trial_start_date?: string | null
        }
        Update: {
          address?: string | null
          business_field?: string | null
          created_at?: string | null
          creator_email?: string | null
          employee_count?: number | null
          grace_period_end?: string | null
          id?: string
          logo_path?: string | null
          name?: string
          phone?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          theme_settings?: Json | null
          trial_end_date?: string | null
          trial_expired?: boolean | null
          trial_start_date?: string | null
        }
        Relationships: []
      }
      payment_logs: {
        Row: {
          attempted_plan_slug: string | null
          created_at: string | null
          error_message: string | null
          id: string
          organization_id: string | null
          payment_gateway: string
          plan_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          attempted_plan_slug?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          organization_id?: string | null
          payment_gateway?: string
          plan_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          attempted_plan_slug?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          organization_id?: string | null
          payment_gateway?: string
          plan_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          provider: string
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          provider: string
          type: string
          updated_at?: string
        }
        Update: {
          code?: string
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          provider?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          gateway_data: Json | null
          id: string
          invoice_id: string | null
          order_id: string | null
          organization_id: string
          payment_details: Json | null
          payment_gateway: string | null
          payment_method_id: string | null
          payment_provider: string
          payment_url: string | null
          provider_reference: string | null
          status: string
          subscription_plan_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          gateway_data?: Json | null
          id?: string
          invoice_id?: string | null
          order_id?: string | null
          organization_id: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_method_id?: string | null
          payment_provider: string
          payment_url?: string | null
          provider_reference?: string | null
          status: string
          subscription_plan_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          gateway_data?: Json | null
          id?: string
          invoice_id?: string | null
          order_id?: string | null
          organization_id?: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_method_id?: string | null
          payment_provider?: string
          payment_url?: string | null
          provider_reference?: string | null
          status?: string
          subscription_plan_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          has_seen_welcome: boolean | null
          id: string
          invited_by: string | null
          last_active: string | null
          organization_id: string | null
          preferences: Json | null
          profile_image: string | null
          role: string | null
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          has_seen_welcome?: boolean | null
          id: string
          invited_by?: string | null
          last_active?: string | null
          organization_id?: string | null
          preferences?: Json | null
          profile_image?: string | null
          role?: string | null
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          has_seen_welcome?: boolean | null
          id?: string
          invited_by?: string | null
          last_active?: string | null
          organization_id?: string | null
          preferences?: Json | null
          profile_image?: string | null
          role?: string | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_links: {
        Row: {
          clicks: number | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          job_position_id: string | null
          organization_id: string
          status: string | null
          submissions: number | null
          token: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          job_position_id?: string | null
          organization_id: string
          status?: string | null
          submissions?: number | null
          token: string
        }
        Update: {
          clicks?: number | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          job_position_id?: string | null
          organization_id?: string
          status?: string | null
          submissions?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruitment_links_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruitment_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reprimands: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          details: string | null
          employee_id: string
          employee_name: string | null
          escalation_level: number | null
          evidence_attachments: Json | null
          id: string
          organization_id: string
          reprimand_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          details?: string | null
          employee_id: string
          employee_name?: string | null
          escalation_level?: number | null
          evidence_attachments?: Json | null
          id?: string
          organization_id: string
          reprimand_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          details?: string | null
          employee_id?: string
          employee_name?: string | null
          escalation_level?: number | null
          evidence_attachments?: Json | null
          id?: string
          organization_id?: string
          reprimand_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reprimands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reprimands_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reprimands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_analytics: {
        Row: {
          additional_data: Json | null
          created_at: string
          event_type: string
          id: string
          organization_id: string
          plan_id: string | null
          previous_plan_id: string | null
          user_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          event_type: string
          id?: string
          organization_id: string
          plan_id?: string | null
          previous_plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          event_type?: string
          id?: string
          organization_id?: string
          plan_id?: string | null
          previous_plan_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_audit_logs: {
        Row: {
          action: string
          created_at: string
          data: Json | null
          id: string
          organization_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          data?: Json | null
          id?: string
          organization_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          data?: Json | null
          id?: string
          organization_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          deskripsi: string | null
          direct_payment_url: string | null
          features: Json | null
          id: string
          is_active: boolean
          max_members: number | null
          name: string
          price: number
          price_per_member: number | null
          slug: string | null
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          direct_payment_url?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          max_members?: number | null
          name: string
          price?: number
          price_per_member?: number | null
          slug?: string | null
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          direct_payment_url?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          max_members?: number | null
          name?: string
          price?: number
          price_per_member?: number | null
          slug?: string | null
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          goal_id: string | null
          id: string
          organization_id: string
          transaction_date: string
          type: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          organization_id: string
          transaction_date?: string
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          organization_id?: string
          transaction_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      financial_summary: {
        Row: {
          month: string | null
          net_cashflow: number | null
          organization_id: string | null
          total_expenses: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_trial_expirations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_user_has_organization: {
        Args: { user_id: string }
        Returns: {
          organization_id: string
          email_verified: boolean
          has_seen_welcome: boolean
        }[]
      }
      count_organization_employees: {
        Args: { org_id: string }
        Returns: number
      }
      create_organization_with_profile: {
        Args:
          | {
              user_id: string
              org_name: string
              org_business_field: string
              org_employee_count: number
              org_address: string
              org_phone: string
              user_role: string
            }
          | {
              user_id: string
              org_name: string
              org_business_field: string
              org_employee_count: number
              org_address: string
              org_phone: string
              user_role: string
              creator_email?: string
            }
        Returns: Json
      }
      create_status_option: {
        Args: { p_value: string; p_label: string; p_org_id: string }
        Returns: {
          id: string
          value: string
          label: string
          is_system: boolean
        }[]
      }
      delete_status_option: {
        Args: { p_id: string }
        Returns: boolean
      }
      employee_belongs_to_users_org: {
        Args:
          | { employee_row: Database["public"]["Tables"]["employees"]["Row"] }
          | { employee_uuid: string }
        Returns: boolean
      }
      employee_id_belongs_to_users_org: {
        Args: { employee_id: string }
        Returns: boolean
      }
      extend_organization_trial: {
        Args: { org_id: string; days_to_add: number }
        Returns: Json
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_magic_link_invitation: {
        Args: { email_address: string; org_id: string; user_role?: string }
        Returns: Json
      }
      generate_recruitment_link: {
        Args: {
          p_organization_id: string
          p_job_position_id?: string
          p_expires_in_days?: number
        }
        Returns: string
      }
      get_billing_history: {
        Args: { org_id: string }
        Returns: {
          id: string
          created_at: string
          type: string
          amount: number
          status: string
          invoice_url: string
          data: Json
        }[]
      }
      get_recruitment_link_info: {
        Args: { p_token: string }
        Returns: {
          organization_id: string
          job_position_id: string
          job_title: string
          organization_name: string
          is_valid: boolean
        }[]
      }
      get_status_options: {
        Args: { org_id: string }
        Returns: {
          id: string
          value: string
          label: string
          is_system: boolean
        }[]
      }
      get_unique_organization_names: {
        Args: { org_id: string }
        Returns: {
          organization_name: string
        }[]
      }
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          role: string
          logo_path: string
        }[]
      }
      get_user_profile_by_id: {
        Args: { user_id: string }
        Returns: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          has_seen_welcome: boolean | null
          id: string
          invited_by: string | null
          last_active: string | null
          organization_id: string | null
          preferences: Json | null
          profile_image: string | null
          role: string | null
          timezone: string | null
        }[]
      }
      increment_recruitment_link_clicks: {
        Args: { p_token: string }
        Returns: undefined
      }
      internal_submit_job_application: {
        Args: {
          p_job_position_id: string
          p_recruitment_link_id: string
          p_full_name: string
          p_email: string
          p_phone: string
          p_address: string
          p_birth_date: string
          p_birth_place: string
          p_gender: string
          p_religion: string
          p_marital_status: string
          p_blood_type: string
          p_nik: string
          p_passport_number: string
          p_passport_expiry: string
          p_postal_code: string
          p_citizen_address: string
          p_organization_id: string
          p_family_members?: Json
          p_formal_education?: Json
          p_informal_education?: Json
          p_work_experience?: Json
        }
        Returns: Json
      }
      is_in_same_organization: {
        Args: { profile_id: string }
        Returns: boolean
      }
      join_organization: {
        Args: { user_id: string; invitation_token: string }
        Returns: {
          success: boolean
          message: string
        }[]
      }
      process_magic_link_invitation: {
        Args: { invitation_token: string; user_id: string }
        Returns: Json
      }
      remove_organization_member: {
        Args: { member_id: string }
        Returns: Json
      }
      update_status_option: {
        Args: { p_id: string; p_value: string; p_label: string }
        Returns: {
          id: string
          value: string
          label: string
          is_system: boolean
        }[]
      }
      update_user_organization: {
        Args: { user_id: string; org_id: string; user_role: string }
        Returns: undefined
      }
      update_user_profile_with_password: {
        Args:
          | {
              user_id: string
              full_name: string
              timezone: string
              preferences: Json
              current_password: string
              new_password: string
            }
          | {
              user_id: string
              full_name: string
              timezone: string
              preferences: Json
              profile_image?: string
              current_password?: string
              new_password?: string
            }
        Returns: Json
      }
      validate_invitation: {
        Args: { invitation_token: string; invitee_email: string }
        Returns: {
          organization_id: string
          valid: boolean
          message: string
          role: string
        }[]
      }
    }
    Enums: {
      reprimand_type: "Verbal" | "Written" | "PIP" | "Suspension"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      reprimand_type: ["Verbal", "Written", "PIP", "Suspension"],
    },
  },
} as const
