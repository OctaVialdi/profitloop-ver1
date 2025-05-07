
import { supabase } from "@/integrations/supabase/client";

export interface CandidateApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  birth_date: string | null;
  birth_place: string | null;
  gender: string | null;
  religion: string | null;
  marital_status: string | null;
  blood_type: string | null;
  nik: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  postal_code: string | null;
  citizen_address: string | null;
  status: string;
  job_position_id: string | null;
  organization_id: string;
  recruitment_link_id: string;
  created_at: string;
}

export interface CandidateWithDetails extends CandidateApplication {
  familyMembers?: CandidateFamilyMember[];
  formalEducation?: CandidateFormalEducation[];
  informalEducation?: CandidateInformalEducation[];
  workExperience?: CandidateWorkExperience[];
  job_title?: string;
  organization_name?: string;
}

export interface CandidateFamilyMember {
  id: string;
  candidate_application_id: string;
  name: string;
  relationship: string | null;
  gender: string | null;
  age: number | null;
  occupation: string | null;
  phone: string | null;
  address: string | null;
  is_emergency_contact: boolean;
}

export interface CandidateFormalEducation {
  id: string;
  candidate_application_id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  description: string | null;
}

export interface CandidateInformalEducation {
  id: string;
  candidate_application_id: string;
  course_name: string;
  provider: string;
  certification_field: string;
  certificate_number: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface CandidateWorkExperience {
  id: string;
  candidate_application_id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  job_description: string | null;
}

export const candidateService = {
  async fetchCandidates(): Promise<CandidateApplication[]> {
    try {
      const { data: candidates, error } = await supabase
        .from("candidate_applications")
        .select(`
          *,
          job_positions(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return candidates.map(candidate => ({
        ...candidate,
        job_title: candidate.job_positions?.title || "General Application"
      }));
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  },

  async fetchCandidateById(id: string): Promise<CandidateWithDetails | null> {
    try {
      // Fetch the main candidate application data
      const { data: candidate, error } = await supabase
        .from("candidate_applications")
        .select(`
          *,
          job_positions(title),
          organizations(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!candidate) return null;

      // Fetch family members
      const { data: familyMembers } = await supabase
        .from("candidate_family_members")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch formal education
      const { data: formalEducation } = await supabase
        .from("candidate_formal_education")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch informal education
      const { data: informalEducation } = await supabase
        .from("candidate_informal_education")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch work experience
      const { data: workExperience } = await supabase
        .from("candidate_work_experience")
        .select("*")
        .eq("candidate_application_id", id);

      // Combine all data into a single object
      return {
        ...candidate,
        job_title: candidate.job_positions?.title || "General Application",
        organization_name: candidate.organizations?.name || "",
        familyMembers: familyMembers || [],
        formalEducation: formalEducation || [],
        informalEducation: informalEducation || [],
        workExperience: workExperience || []
      };
    } catch (error) {
      console.error("Error fetching candidate by id:", error);
      return null;
    }
  },
  
  async updateCandidateStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("candidate_applications")
        .update({ status })
        .eq("id", id);

      return !error;
    } catch (error) {
      console.error("Error updating candidate status:", error);
      return false;
    }
  }
};
