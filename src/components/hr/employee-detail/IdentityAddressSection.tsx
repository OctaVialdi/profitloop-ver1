
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { EditIdentityAddressDialog } from "./edit/EditIdentityAddressDialog";

interface IdentityAddressSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const openEditDialog = () => {
    setEditDialogOpen(true);
  };
  
  const handleSave = () => {
    setEditDialogOpen(false);
    // Refresh data
    handleEdit("refresh");
  };
  
  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Identity & Address</h2>
        </div>
        
        <div className="border rounded-md">
          <div className="flex justify-between items-center p-3 border-b">
            <div></div>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2 flex items-center"
              onClick={openEditDialog}
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">NIK (16 digit)</p>
                <p className="font-medium">{employee.nik || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport number</p>
                <p className="font-medium">{employee.passportNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport expiration date</p>
                <p className="font-medium">{employee.passportExpiry || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal code</p>
                <p className="font-medium">{employee.postalCode || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Citizen ID address</p>
                <p className="font-medium">{employee.citizenAddress || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Residential address</p>
                <p className="font-medium">{employee.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EditIdentityAddressDialog 
        open={editDialogOpen}
        employee={employee}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
      />
    </Card>
  );
};
