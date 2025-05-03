
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./PersonalSection";

interface TimeManagementSectionProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const TimeManagementSection: React.FC<TimeManagementSectionProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const timeTitle = activeTab === 'attendance' ? 'Attendance' : 
                    activeTab === 'schedule' ? 'Schedule' : 'Time Off';
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{timeTitle}</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description={`Your ${timeTitle.toLowerCase()} data will be displayed here.`}
          section={activeTab}
          handleEdit={handleEdit}
        />
      </div>
    </Card>
  );
};
