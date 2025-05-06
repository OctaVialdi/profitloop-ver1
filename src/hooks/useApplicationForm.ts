
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define interfaces for the form data and link info
export interface ApplicationFormData {
  // Personal information
  fullName: string;
  email: string;
  mobilePhone: string;
  birthPlace: string;
  birthdate: Date | null;
  gender: string;
  maritalStatus: string;
  bloodType: string;
  religion: string;
  
  // Identity & Address
  nik: string;
  passportNumber: string;
  passportExpiry: Date | null;
  postalCode: string;
  citizenAddress: string;
  residentialAddress: string;
}

export interface LinkInfo {
  organization_id: string;
  job_position_id: string;
  job_title: string;
  organization_name: string;
  is_valid: boolean;
}

export const useApplicationForm = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    mobilePhone: "",
    birthPlace: "",
    birthdate: null,
    gender: "",
    maritalStatus: "",
    bloodType: "",
    religion: "",
    
    nik: "",
    passportNumber: "",
    passportExpiry: null,
    postalCode: "",
    citizenAddress: "",
    residentialAddress: "",
  });
  
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [formalEducation, setFormalEducation] = useState<any[]>([]);
  const [informalEducation, setInformalEducation] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  // Handle form field updates
  const handleFormUpdate = (section: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value
    }));
  };

  // Validate token and fetch job position info
  const validateRecruitmentLink = async () => {
    try {
      if (!token) {
        setInvalidLink(true);
        return;
      }
      
      const { data, error } = await supabase
        .rpc('get_recruitment_link_info', { p_token: token });
      
      if (error) {
        console.error("Error validating link:", error);
        setInvalidLink(true);
        return;
      }
      
      if (!data || !data[0] || !data[0].is_valid) {
        setInvalidLink(true);
        return;
      }
      
      setLinkInfo(data[0]);
    } catch (error) {
      console.error("Error:", error);
      setInvalidLink(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.fullName || !formData.email) {
        toast.error("Please fill out all required fields.");
        setIsSubmitting(false);
        return;
      }
      
      if (!linkInfo) {
        toast.error("Invalid application link.");
        setIsSubmitting(false);
        return;
      }
      
      // Insert candidate application
      const applicationData = {
        job_position_id: linkInfo.job_position_id,
        recruitment_link_id: token || '',
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.mobilePhone,
        address: formData.residentialAddress,
        birth_date: formData.birthdate ? formData.birthdate.toISOString() : null,
        birth_place: formData.birthPlace,
        gender: formData.gender,
        religion: formData.religion,
        marital_status: formData.maritalStatus,
        blood_type: formData.bloodType,
        nik: formData.nik,
        passport_number: formData.passportNumber,
        passport_expiry: formData.passportExpiry ? formData.passportExpiry.toISOString() : null,
        postal_code: formData.postalCode,
        citizen_address: formData.citizenAddress,
        organization_id: linkInfo.organization_id
      };
      
      const { data: insertedData, error: applicationError } = await supabase
        .from('candidate_applications')
        .insert(applicationData)
        .select('id')
        .single();
      
      if (applicationError) {
        throw applicationError;
      }
      
      const applicationId = insertedData.id;
      
      // Insert family members
      if (familyMembers.length > 0) {
        const familyData = familyMembers.map(member => ({
          candidate_application_id: applicationId,
          name: member.name,
          relationship: member.relationship,
          gender: member.gender,
          age: member.age,
          occupation: member.occupation,
          phone: member.phone,
          address: member.address,
          is_emergency_contact: member.isEmergencyContact
        }));
        
        const { error: familyError } = await supabase
          .from('candidate_family_members')
          .insert(familyData);
          
        if (familyError) {
          throw familyError;
        }
      }
      
      // Insert formal education
      if (formalEducation.length > 0) {
        const educationData = formalEducation.map(edu => ({
          candidate_application_id: applicationId,
          institution_name: edu.institutionName,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy,
          start_date: edu.startDate,
          end_date: edu.endDate,
          grade: edu.grade,
          description: edu.description
        }));
        
        const { error: educationError } = await supabase
          .from('candidate_formal_education')
          .insert(educationData);
          
        if (educationError) {
          throw educationError;
        }
      }
      
      // Insert informal education
      if (informalEducation.length > 0) {
        const informalData = informalEducation.map(edu => ({
          candidate_application_id: applicationId,
          course_name: edu.courseName,
          provider: edu.provider,
          certification_field: edu.certificationField,
          certificate_number: edu.certificateNumber,
          start_date: edu.startDate,
          end_date: edu.endDate,
          description: edu.description
        }));
        
        const { error: informalError } = await supabase
          .from('candidate_informal_education')
          .insert(informalData);
          
        if (informalError) {
          throw informalError;
        }
      }
      
      // Insert work experience
      if (workExperience.length > 0) {
        const workData = workExperience.map(work => ({
          candidate_application_id: applicationId,
          company_name: work.companyName,
          position: work.position,
          location: work.location,
          start_date: work.startDate,
          end_date: work.endDate,
          job_description: work.jobDescription
        }));
        
        const { error: workError } = await supabase
          .from('candidate_work_experience')
          .insert(workData);
          
        if (workError) {
          throw workError;
        }
      }
      
      // Show success message
      toast.success("Application submitted successfully!");
      setSubmissionSuccess(true);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(`Error submitting application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    token,
    activeTab,
    setActiveTab,
    formData,
    handleFormUpdate,
    familyMembers,
    setFamilyMembers,
    formalEducation,
    setFormalEducation,
    informalEducation,
    setInformalEducation,
    workExperience,
    setWorkExperience,
    isLoading,
    isSubmitting,
    linkInfo,
    invalidLink,
    submissionSuccess,
    validateRecruitmentLink,
    handleSubmit,
    navigate
  };
};
