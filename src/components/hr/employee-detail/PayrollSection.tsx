
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface PayrollSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const PayrollSection: React.FC<PayrollSectionProps> = ({
  employee,
  handleEdit
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Payroll Information</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Payroll data</h3>
          <p className="text-sm text-gray-500 mb-4">Your payroll information data will be displayed here.</p>
          
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <div></div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 flex items-center"
                onClick={() => handleEdit("payroll-info")}
              >
                <Edit size={14} /> Edit
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Basic salary</p>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank name</p>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account number</p>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account name</p>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
