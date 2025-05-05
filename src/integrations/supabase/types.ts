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
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          organization_id: string
          role: string | null
          status: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          organization_id: string
          role?: string | null
          status?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          organization_id?: string
          role?: string | null
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_link_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          organization_id: string
          role: string
          status: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          organization_id: string
          role?: string
          status?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          organization_id?: string
          role?: string
          status?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_link_invitations_organization_id_fkey"
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
          id: string
          logo_path: string | null
          name: string
          phone: string | null
          subscription_plan_id: string | null
          theme_settings: Json | null
          trial_end_date: string | null
          trial_expired: boolean | null
        }
        Insert: {
          address?: string | null
          business_field?: string | null
          created_at?: string | null
          creator_email?: string | null
          employee_count?: number | null
          id?: string
          logo_path?: string | null
          name: string
          phone?: string | null
          subscription_plan_id?: string | null
          theme_settings?: Json | null
          trial_end_date?: string | null
          trial_expired?: boolean | null
        }
        Update: {
          address?: string | null
          business_field?: string | null
          created_at?: string | null
          creator_email?: string | null
          employee_count?: number | null
          id?: string
          logo_path?: string | null
          name?: string
          phone?: string | null
          subscription_plan_id?: string | null
          theme_settings?: Json | null
          trial_end_date?: string | null
          trial_expired?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          max_members: number | null
          name: string
          price: number | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          max_members?: number | null
          name: string
          price?: number | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          max_members?: number | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_has_organization: {
        Args: { user_id: string }
        Returns: {
          organization_id: string
          email_verified: boolean
          has_seen_welcome: boolean
        }[]
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
      employee_belongs_to_users_org: {
        Args: { employee_row: Database["public"]["Tables"]["employees"]["Row"] }
        Returns: boolean
      }
      employee_id_belongs_to_users_org: {
        Args: { employee_id: string }
        Returns: boolean
      }
      generate_magic_link_invitation: {
        Args: { email_address: string; org_id: string; user_role?: string }
        Returns: Json
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
          role: string | null
          timezone: string | null
        }[]
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
      update_user_organization: {
        Args: { user_id: string; org_id: string; user_role: string }
        Returns: undefined
      }
      update_user_profile_with_password: {
        Args: {
          user_id: string
          full_name: string
          timezone: string
          preferences: Json
          current_password: string
          new_password: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
