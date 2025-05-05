
import React, { useState, useEffect } from "react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FormalEducationList, 
  InformalEducationList,
  WorkExperienceList
} from "./employee-detail/education";
import { 
  FormalEducation,
  InformalEducation,
  WorkExperience, 
  educationService 
} from "@/services/educationService";
import { useQuery } from "@tanstack/react-query";

interface EducationSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ employee, handleEdit }) => {
  const [activeTab, setActiveTab] = useState("formal");
  const employeeId = employee.id;

  // Fetch formal education data
  const { 
    data: formalEducations = [], 
    isLoading: isFormalLoading,
    error: formalError,
    refetch: refetchFormalEducation
  } = useQuery({
    queryKey: ['formalEducation', employeeId],
    queryFn: () => educationService.getFormalEducation(employeeId),
    enabled: !!employeeId
  });

  // Fetch informal education data
  const { 
    data: informalEducations = [], 
    isLoading: isInformalLoading,
    error: informalError,
    refetch: refetchInformalEducation
  } = useQuery({
    queryKey: ['informalEducation', employeeId],
    queryFn: () => educationService.getInformalEducation(employeeId),
    enabled: !!employeeId
  });

  // Fetch work experience data
  const { 
    data: workExperiences = [], 
    isLoading: isWorkExpLoading,
    error: workExpError,
    refetch: refetchWorkExperience
  } = useQuery({
    queryKey: ['workExperience', employeeId],
    queryFn: () => educationService.getWorkExperience(employeeId),
    enabled: !!employeeId
  });

  // Log errors if any
  useEffect(() => {
    if (formalError) console.error("Error fetching formal education:", formalError);
    if (informalError) console.error("Error fetching informal education:", informalError);
    if (workExpError) console.error("Error fetching work experience:", workExpError);
  }, [formalError, informalError, workExpError]);

  // Refetch all data when employee changes
  useEffect(() => {
    if (employeeId) {
      refetchFormalEducation();
      refetchInformalEducation();
      refetchWorkExperience();
    }
  }, [employeeId, refetchFormalEducation, refetchInformalEducation, refetchWorkExperience]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Education & Experience</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="formal">Formal Education</TabsTrigger>
            <TabsTrigger value="informal">Informal Education</TabsTrigger>
            <TabsTrigger value="experience">Work Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="formal">
            <FormalEducationList 
              items={formalEducations} 
              isLoading={isFormalLoading}
              employeeId={employeeId}
              onDataChanged={refetchFormalEducation}
            />
          </TabsContent>

          <TabsContent value="informal">
            <InformalEducationList 
              items={informalEducations} 
              isLoading={isInformalLoading}
              employeeId={employeeId}
              onDataChanged={refetchInformalEducation}
            />
          </TabsContent>

          <TabsContent value="experience">
            <WorkExperienceList 
              items={workExperiences} 
              isLoading={isWorkExpLoading}
              employeeId={employeeId}
              onDataChanged={refetchWorkExperience}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
