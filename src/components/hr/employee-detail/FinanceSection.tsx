
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, FileText, Banknote } from "lucide-react";

interface FinanceSectionProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

interface FinanceItem {
  id: string;
  amount: string;
  description: string;
  date: string;
  status: string;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const financeTitle = activeTab === 'reimbursement' ? 'Reimbursement' : 
                  activeTab === 'cash-advance' ? 'Cash Advance' : 'Loan';
  
  // This would be replaced with actual financial data from the API
  const [items, setItems] = useState<FinanceItem[]>([]);
  
  const getIcon = () => {
    switch(activeTab) {
      case 'reimbursement': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'cash-advance': return <Banknote className="h-5 w-5 text-green-500" />;
      default: return <DollarSign className="h-5 w-5 text-purple-500" />;
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            {getIcon()}
            <h2 className="text-2xl font-bold ml-2">{financeTitle}</h2>
          </div>
          <Button 
            size="sm"
            onClick={() => handleEdit(activeTab)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add {financeTitle}
          </Button>
        </div>
        
        {items.length === 0 ? (
          <EmptyDataDisplay 
            title="There is no data to display"
            description={`Your ${financeTitle.toLowerCase()} data will be displayed here.`}
            section={activeTab}
            handleEdit={handleEdit}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
              <div className="col-span-3">Date</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Status</div>
            </div>
            
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-12 text-sm py-2 hover:bg-gray-50 rounded">
                <div className="col-span-3">{item.date}</div>
                <div className="col-span-3">{item.amount}</div>
                <div className="col-span-4">{item.description}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
