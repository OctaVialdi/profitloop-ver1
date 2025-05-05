
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { Loader2 } from "lucide-react";
import { FormalEducation, educationService } from "@/services/educationService";
import { FormalEducationList } from "./education/FormalEducationList";
import { toast } from "sonner";

interface EducationSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [formalEducation, setFormalEducation] = useState<FormalEducation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("formal-education");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFormalEducation = async () => {
    if (!employee?.id) return;
    
    setIsLoading(true);
    try {
      const educationData = await educationService.getFormalEducation(employee.id);
      setFormalEducation(educationData);
    } catch (error) {
      console.error("Failed to fetch formal education:", error);
      toast.error("Failed to load education data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchFormalEducation();
  }, [employee?.id]);

  const refreshEducationData = async () => {
    if (!employee?.id) return;

    setIsRefreshing(true);
    try {
      const educationData = await educationService.getFormalEducation(employee.id);
      setFormalEducation(educationData);
    } catch (error) {
      console.error("Failed to refresh formal education:", error);
      toast.error("Failed to refresh education data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Education & experience</h2>
          
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
              />
            )}
          </TabsContent>

          <TabsContent value="informal-education" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your informal education data will be displayed here."
              section="informal-education"
              handleEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="working-experience" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your working experience data will be displayed here."
              section="working-experience"
              handleEdit={handleEdit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
