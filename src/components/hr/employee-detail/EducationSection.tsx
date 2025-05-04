
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./PersonalSection";

interface EducationSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  employee,
  handleEdit
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Education & experience</h2>
        </div>

        <Tabs defaultValue="formal-education">
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

          <TabsContent value="formal-education" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your formal education data will be displayed here."
              section="formal-education"
              handleEdit={handleEdit}
            />
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
