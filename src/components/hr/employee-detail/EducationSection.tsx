
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { Loader2, Plus } from "lucide-react";
import { 
  FormalEducation, 
  InformalEducation, 
  WorkExperience, 
  educationService 
} from "@/services/educationService";
import { FormalEducationList } from "./education/FormalEducationList";
import { InformalEducationList } from "./education/InformalEducationList";
import { WorkExperienceList } from "./education/WorkExperienceList";
import { toast } from "sonner";
import { AddFormalEducationDialog } from "./edit/AddFormalEducationDialog";
import { AddInformalEducationDialog } from "./edit/AddInformalEducationDialog";
import { AddWorkExperienceDialog } from "./edit/AddWorkExperienceDialog";

interface EducationSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  employee,
  handleEdit
}) => {
  console.log("EducationSection rendering with employee:", employee);
  
  const [formalEducation, setFormalEducation] = useState<FormalEducation[]>([]);
  const [informalEducation, setInformalEducation] = useState<InformalEducation[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("formal-education");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addFormalDialogOpen, setAddFormalDialogOpen] = useState(false);
  const [addInformalDialogOpen, setAddInformalDialogOpen] = useState(false);
  const [addWorkExperienceDialogOpen, setAddWorkExperienceDialogOpen] = useState(false);

  const fetchFormalEducation = async () => {
    if (!employee?.id) {
      console.error("Cannot fetch formal education: No employee ID provided");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching formal education for employee ID:", employee.id);
      const educationData = await educationService.getFormalEducation(employee.id);
      console.log("Fetched formal education data:", educationData);
      setFormalEducation(educationData);
    } catch (error) {
      console.error("Failed to fetch formal education:", error);
      toast.error("Failed to load education data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInformalEducation = async () => {
    if (!employee?.id) {
      console.error("Cannot fetch informal education: No employee ID provided");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching informal education for employee ID:", employee.id);
      const educationData = await educationService.getInformalEducation(employee.id);
      console.log("Fetched informal education data:", educationData);
      setInformalEducation(educationData);
    } catch (error) {
      console.error("Failed to fetch informal education:", error);
      toast.error("Failed to load education data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkExperience = async () => {
    if (!employee?.id) {
      console.error("Cannot fetch work experience: No employee ID provided");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching work experience for employee ID:", employee.id);
      const experienceData = await educationService.getWorkExperience(employee.id);
      console.log("Fetched work experience data:", experienceData);
      setWorkExperience(experienceData);
    } catch (error) {
      console.error("Failed to fetch work experience:", error);
      toast.error("Failed to load experience data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (employee?.id) {
      console.log(`Initializing EducationSection with employee ID: ${employee.id} and active tab: ${activeTab}`);
      if (activeTab === "formal-education") {
        fetchFormalEducation();
      } else if (activeTab === "informal-education") {
        fetchInformalEducation();
      } else if (activeTab === "working-experience") {
        fetchWorkExperience();
      }
    } else {
      console.warn("EducationSection initialized without a valid employee ID");
    }
  }, [employee?.id, activeTab]);

  const refreshEducationData = async () => {
    if (!employee?.id) return;

    setIsRefreshing(true);
    try {
      if (activeTab === "formal-education") {
        const educationData = await educationService.getFormalEducation(employee.id);
        setFormalEducation(educationData);
      } else if (activeTab === "informal-education") {
        const educationData = await educationService.getInformalEducation(employee.id);
        setInformalEducation(educationData);
      } else if (activeTab === "working-experience") {
        const experienceData = await educationService.getWorkExperience(employee.id);
        setWorkExperience(experienceData);
      }
    } catch (error) {
      console.error(`Failed to refresh ${activeTab}:`, error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddButtonClick = () => {
    console.log(`Add button clicked for tab: ${activeTab}, employee ID: ${employee.id}`);
    if (activeTab === "formal-education") {
      setAddFormalDialogOpen(true);
    } else if (activeTab === "informal-education") {
      setAddInformalDialogOpen(true);
    } else if (activeTab === "working-experience") {
      setAddWorkExperienceDialogOpen(true);
    } else {
      handleEdit(activeTab);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Education & experience</h2>
          
          <div className="flex gap-4">
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAddButtonClick}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> 
              {activeTab === "formal-education" && "Add Formal Education"}
              {activeTab === "informal-education" && "Add Informal Education"}
              {activeTab === "working-experience" && "Add Work Experience"}
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={refreshEducationData}
              disabled={isLoading || isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="formal-education">
          <div className="flex justify-between items-center mb-2">
            <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
              <TabsTrigger value="formal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                Formal education
              </TabsTrigger>
              <TabsTrigger value="informal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                Informal education
              </TabsTrigger>
              <TabsTrigger value="working-experience" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                Working experience
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="formal-education" className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : formalEducation.length > 0 ? (
              <FormalEducationList 
                educationList={formalEducation} 
                onEducationUpdated={refreshEducationData} 
              />
            ) : (
              <EmptyDataDisplay 
                title="There is no data to display"
                description="Your formal education data will be displayed here."
                section="formal-education"
                handleEdit={handleEdit}
                buttonText="Add Formal Education"
                onClick={() => setAddFormalDialogOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="informal-education" className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : informalEducation.length > 0 ? (
              <InformalEducationList 
                educationList={informalEducation} 
                onEducationUpdated={refreshEducationData} 
              />
            ) : (
              <EmptyDataDisplay 
                title="There is no data to display"
                description="Your informal education data will be displayed here."
                section="informal-education"
                handleEdit={handleEdit}
                buttonText="Add Informal Education"
                onClick={() => setAddInformalDialogOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="working-experience" className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : workExperience.length > 0 ? (
              <WorkExperienceList 
                experienceList={workExperience} 
                onExperienceUpdated={refreshEducationData} 
              />
            ) : (
              <EmptyDataDisplay 
                title="There is no data to display"
                description="Your working experience data will be displayed here."
                section="working-experience"
                handleEdit={handleEdit}
                buttonText="Add Work Experience"
                onClick={() => setAddWorkExperienceDialogOpen(true)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Formal Education Dialog */}
      {employee?.id && (
        <AddFormalEducationDialog
          open={addFormalDialogOpen}
          employeeId={employee.id}
          onOpenChange={setAddFormalDialogOpen}
          onSuccess={() => {
            refreshEducationData();
          }}
        />
      )}

      {/* Add Informal Education Dialog */}
      {employee?.id && (
        <AddInformalEducationDialog
          open={addInformalDialogOpen}
          employeeId={employee.id}
          onOpenChange={setAddInformalDialogOpen}
          onSuccess={() => {
            refreshEducationData();
          }}
        />
      )}

      {/* Add Work Experience Dialog */}
      {employee?.id && (
        <AddWorkExperienceDialog
          open={addWorkExperienceDialogOpen}
          employeeId={employee.id}
          onOpenChange={setAddWorkExperienceDialogOpen}
          onSuccess={() => {
            refreshEducationData();
          }}
        />
      )}
    </Card>
  );
};
