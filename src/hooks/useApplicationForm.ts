
import { useState, useEffect } from "react";
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
        console.error("No token provided");
        setInvalidLink(true);
        return;
      }
      
      console.log("Validating recruitment link with token:", token);
      
      const { data, error } = await supabase
        .rpc('get_recruitment_link_info', { p_token: token });
      
      if (error) {
        console.error("Error validating link:", error);
        setInvalidLink(true);
        return;
      }
      
      if (!data || data.length === 0 || !data[0] || !data[0].is_valid) {
        console.error("Invalid link data:", data);
        setInvalidLink(true);
        return;
      }
      
      console.log("Link info retrieved:", data[0]);
      setLinkInfo(data[0]);
    } catch (error) {
      console.error("Error:", error);
      setInvalidLink(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for database
  const formatDateForDb = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };
  
  // Validate required fields
  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.fullName) {
      toast.error("Nama lengkap wajib diisi");
      setActiveTab("personal");
      return false;
    }
    
    if (!formData.email) {
      toast.error("Email wajib diisi");
      setActiveTab("personal");
      return false;
    }
    
    if (!linkInfo) {
      toast.error("Link aplikasi tidak valid");
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      
      console.log("Starting submission with token:", token);
      console.log("Link info for submission:", linkInfo);
      console.log("Submitting application with data:", {
        formData,
        linkInfo,
        familyMembers: familyMembers.length,
        education: {
          formal: formalEducation.length,
          informal: informalEducation.length
        },
        workExperience: workExperience.length
      });
      
      // Insert candidate application
      const applicationData = {
        job_position_id: linkInfo?.job_position_id,
        recruitment_link_id: token || '',
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.mobilePhone,
        address: formData.residentialAddress,
        birth_date: formatDateForDb(formData.birthdate),
        birth_place: formData.birthPlace,
        gender: formData.gender,
        religion: formData.religion,
        marital_status: formData.maritalStatus,
        blood_type: formData.bloodType,
        nik: formData.nik,
        passport_number: formData.passportNumber,
        passport_expiry: formatDateForDb(formData.passportExpiry),
        postal_code: formData.postalCode,
        citizen_address: formData.citizenAddress,
        organization_id: linkInfo?.organization_id
      };
      
      console.log("Inserting application data:", applicationData);
      
      const { data: insertedData, error: applicationError } = await supabase
        .from('candidate_applications')
        .insert(applicationData)
        .select('id')
        .single();
      
      if (applicationError) {
        console.error("Error inserting application:", applicationError);
        toast.error(`Error: ${applicationError.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log("Application created with ID:", insertedData?.id);
      const applicationId = insertedData?.id;
      
      if (!applicationId) {
        throw new Error("Failed to get application ID");
      }
      
      // Insert family members
      if (familyMembers.length > 0) {
        const familyData = familyMembers.map(member => ({
          candidate_application_id: applicationId,
          name: member.name,
          relationship: member.relationship,
          gender: member.gender,
          age: parseInt(member.age) || null,
          occupation: member.occupation,
          phone: member.phone,
          address: member.address,
          is_emergency_contact: member.isEmergencyContact || false
        }));
        
        console.log("Inserting family members:", familyData);
        
        const { error: familyError } = await supabase
          .from('candidate_family_members')
          .insert(familyData);
          
        if (familyError) {
          console.error("Error inserting family members:", familyError);
          // Continue with other insertions even if this fails
        }
      }
      
      // Insert formal education
      if (formalEducation.length > 0) {
        const educationData = formalEducation.map(edu => ({
          candidate_application_id: applicationId,
          institution_name: edu.institutionName,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy,
          start_date: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : null,
          end_date: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : null,
          grade: edu.grade,
          description: edu.description
        }));
        
        console.log("Inserting formal education:", educationData);
        
        const { error: educationError } = await supabase
          .from('candidate_formal_education')
          .insert(educationData);
          
        if (educationError) {
          console.error("Error inserting formal education:", educationError);
          // Continue with other insertions even if this fails
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
          start_date: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : null,
          end_date: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : null,
          description: edu.description
        }));
        
        console.log("Inserting informal education:", informalData);
        
        const { error: informalError } = await supabase
          .from('candidate_informal_education')
          .insert(informalData);
          
        if (informalError) {
          console.error("Error inserting informal education:", informalError);
          // Continue with other insertions even if this fails
        }
      }
      
      // Insert work experience
      if (workExperience.length > 0) {
        const workData = workExperience.map(work => ({
          candidate_application_id: applicationId,
          company_name: work.companyName,
          position: work.position,
          location: work.location,
          start_date: work.startDate ? new Date(work.startDate).toISOString().split('T')[0] : null,
          end_date: work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : null,
          job_description: work.jobDescription
        }));
        
        console.log("Inserting work experience:", workData);
        
        const { error: workError } = await supabase
          .from('candidate_work_experience')
          .insert(workData);
          
        if (workError) {
          console.error("Error inserting work experience:", workError);
          // Continue with other insertions even if this fails
        }
      }
      
      // Show success message
      toast.success("Application submitted successfully!");
      setSubmissionSuccess(true);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(`Error submitting application: ${error.message || "Unknown error"}`);
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
