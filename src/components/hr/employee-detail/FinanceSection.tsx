
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface FinanceSectionProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const financeTitle = activeTab === 'reimbursement' ? 'Reimbursement' : 
                  activeTab === 'cash-advance' ? 'Cash Advance' : 'Loan';
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{financeTitle}</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description={`Your ${financeTitle.toLowerCase()} data will be displayed here.`}
          section={activeTab}
          handleEdit={handleEdit}
        />
      </div>
    </Card>
  );
};
