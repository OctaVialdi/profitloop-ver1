
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface EmploymentSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  employee,
  handleEdit
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Employment</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Employment data</h3>
          <p className="text-sm text-gray-500 mb-4">Your data information related to company.</p>
          
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <div></div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 flex items-center"
                onClick={() => handleEdit("employment")}
              >
                <Edit size={14} /> Edit
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Company name</p>
                  <p className="font-medium">PT CHEMISTRY BEAUTY INDONESIA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{employee.employeeId || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <p className="font-medium">{employee.barcode || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organization name</p>
                  <p className="font-medium">{employee.organization || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job position</p>
                  <p className="font-medium">{employee.jobPosition || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job level</p>
                  <p className="font-medium">{employee.jobLevel || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment status</p>
                  <p className="font-medium">{employee.employmentStatus || "Permanent"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{employee.branch || "Pusat"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join date</p>
                  <p className="font-medium">
                    {employee.joinDate || "-"}
                    {employee.joinDate && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">14 Year 5 Month 24 Day</span>}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sign date</p>
                  <p className="font-medium">{employee.signDate || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
