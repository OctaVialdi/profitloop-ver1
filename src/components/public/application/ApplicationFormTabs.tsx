
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInformationSection } from "@/components/public/application/PersonalInformationSection";
import { IdentityAddressSection } from "@/components/public/application/IdentityAddressSection";
import { FamilyMembersSection } from "@/components/public/application/FamilyMembersSection";
import { FormalEducationSection } from "@/components/public/application/FormalEducationSection";
import { InformalEducationSection } from "@/components/public/application/InformalEducationSection";
import { WorkExperienceSection } from "@/components/public/application/WorkExperienceSection";
import { ApplicationFormData } from "@/hooks/useApplicationForm";

interface ApplicationFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ApplicationFormData;
  updateFormData: (section: keyof ApplicationFormData, value: any) => void;
  familyMembers: any[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<any[]>>;
  formalEducation: any[];
  setFormalEducation: React.Dispatch<React.SetStateAction<any[]>>;
  informalEducation: any[];
  setInformalEducation: React.Dispatch<React.SetStateAction<any[]>>;
  workExperience: any[];
  setWorkExperience: React.Dispatch<React.SetStateAction<any[]>>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const ApplicationFormTabs = ({
  activeTab,
  setActiveTab,
  formData,
  updateFormData,
  familyMembers,
  setFamilyMembers,
  formalEducation,
  setFormalEducation,
  informalEducation,
  setInformalEducation,
  workExperience,
  setWorkExperience,
  handleSubmit,
  isSubmitting
}: ApplicationFormTabsProps) => {
  return (
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
          updateFormData={updateFormData}
        />
        <div className="flex justify-end mt-4">
          <Button onClick={() => setActiveTab("identity")}>Next</Button>
        </div>
      </TabsContent>
      
      <TabsContent value="identity">
        <IdentityAddressSection 
          formData={formData}
          updateFormData={updateFormData}
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
  );
};

export default ApplicationFormTabs;
