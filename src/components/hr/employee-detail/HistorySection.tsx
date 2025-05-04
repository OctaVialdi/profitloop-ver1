
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./PersonalSection";

interface HistorySectionProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const historyTitle = activeTab === 'adjustment' ? 'Adjustment' : 
                  activeTab === 'transfer' ? 'Transfer' : 
                  activeTab === 'npp' ? 'NPP' : 'Reprimand';
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{historyTitle}</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description={`Your ${historyTitle.toLowerCase()} history data will be displayed here.`}
          section={activeTab}
          handleEdit={handleEdit}
        />
      </div>
    </Card>
  );
};
