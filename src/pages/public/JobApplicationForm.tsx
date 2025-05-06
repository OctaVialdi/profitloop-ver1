
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Import form sections
import { PersonalInformationSection } from "@/components/public/application/PersonalInformationSection";
import { IdentityAddressSection } from "@/components/public/application/IdentityAddressSection";
import { FamilyMembersSection } from "@/components/public/application/FamilyMembersSection";
import { FormalEducationSection } from "@/components/public/application/FormalEducationSection";
import { InformalEducationSection } from "@/components/public/application/InformalEducationSection";
import { WorkExperienceSection } from "@/components/public/application/WorkExperienceSection";

// Define application form type
interface ApplicationFormData {
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
  position: string;
  
  // Identity & Address
  nik: string;
  passportNumber: string;
  passportExpiry: Date | null;
  postalCode: string;
  citizenAddress: string;
  residentialAddress: string;
}

interface LinkInfo {
  organization_id: string;
  job_position_id: string;
  job_title: string;
  organization_name: string;
  is_valid: boolean;
}

const JobApplicationForm = () => {
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
    position: "",
    
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
  
  // Validate token and fetch job position info
  useEffect(() => {
    const validateRecruitmentLink = async () => {
      try {
        if (!token) {
          setInvalidLink(true);
          return;
        }
        
        // Call Supabase function to get information about the recruitment link
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
    
    validateRecruitmentLink();
  }, [token]);
  
  const handleFormUpdate = (section: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.position) {
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
      // Map our form fields to the database column names
      const applicationData = {
        name: formData.fullName,             // Changed from full_name to name
        email: formData.email,
        phone: formData.mobilePhone,
        address: formData.residentialAddress,
        birth_date: formData.birthdate,
        birth_place: formData.birthPlace,
        gender: formData.gender,
        religion: formData.religion,
        marital_status: formData.maritalStatus,
        blood_type: formData.bloodType,
        nik: formData.nik,
        passport_number: formData.passportNumber,
        passport_expiry: formData.passportExpiry,
        postal_code: formData.postalCode,
        citizen_address: formData.citizenAddress,
        organization_id: linkInfo.organization_id,
        position: formData.position,
        job_position_id: linkInfo.job_position_id || null,
        recruitment_link_id: token
      };
      
      // Type casting to match expected database schema
      const { data: insertedData, error: applicationError } = await supabase
        .from('candidate_applications')
        .insert(applicationData as any)
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
      
      // Navigate to success page (you could create a dedicated success page)
      navigate("/apply/success");
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(`Error submitting application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Validating application link...</span>
      </div>
    );
  }
  
  if (invalidLink) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-destructive mb-2">Invalid Application Link</h1>
        <p className="text-muted-foreground text-center max-w-md">
          The application link you are trying to access is invalid or has expired. 
          Please contact the recruiter for a new link.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Job Application Form</h1>
        <p className="text-muted-foreground mt-2">
          {linkInfo?.job_title === 'General Application' ? 'Join Our Team' : linkInfo?.job_title} at {linkInfo?.organization_name}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Please fill out all sections of the application form carefully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="formal">Formal Education</TabsTrigger>
              <TabsTrigger value="informal">Informal Education</TabsTrigger>
              <TabsTrigger value="work">Work Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <PersonalInformationSection 
                formData={formData} 
                updateFormData={handleFormUpdate}
              />
              <div className="flex justify-end mt-4">
                <Button onClick={() => setActiveTab("identity")}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="identity">
              <IdentityAddressSection 
                formData={formData}
                updateFormData={handleFormUpdate}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("personal")}>Previous</Button>
                <Button onClick={() => setActiveTab("family")}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="family">
              <FamilyMembersSection 
                familyMembers={familyMembers}
                setFamilyMembers={setFamilyMembers}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("identity")}>Previous</Button>
                <Button onClick={() => setActiveTab("formal")}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="formal">
              <FormalEducationSection 
                formalEducation={formalEducation}
                setFormalEducation={setFormalEducation}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("family")}>Previous</Button>
                <Button onClick={() => setActiveTab("informal")}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="informal">
              <InformalEducationSection 
                informalEducation={informalEducation}
                setInformalEducation={setInformalEducation}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("formal")}>Previous</Button>
                <Button onClick={() => setActiveTab("work")}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="work">
              <WorkExperienceSection 
                workExperience={workExperience}
                setWorkExperience={setWorkExperience}
              />
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setActiveTab("informal")}>Previous</Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationForm;
