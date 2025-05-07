
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
  
  // Handle form submission - Updated to use Edge Function
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
      
      // Prepare data for Edge Function
      const submissionData = {
        token: token,
        linkInfo: linkInfo,
        formData: formData,
        familyMembers: familyMembers,
        formalEducation: formalEducation,
        informalEducation: informalEducation,
        workExperience: workExperience
      };
      
      // Call Edge Function to submit the application
      const { data, error } = await supabase.functions.invoke('submit-job-application', {
        body: submissionData
      });
      
      if (error) {
        console.error("Error from submit-job-application function:", error);
        toast.error(`Error submitting application: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log("Response from submit-job-application function:", data);
      
      if (!data.success) {
        console.error("Application submission failed:", data.error);
        toast.error(`Failed to submit application: ${data.error || "Unknown error"}`);
        setIsSubmitting(false);
        return;
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
