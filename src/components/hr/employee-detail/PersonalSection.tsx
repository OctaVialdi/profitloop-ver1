
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { EditPersonalDetailsDialog } from "./edit/EditPersonalDetailsDialog";

interface PersonalSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
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
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal Data</h2>
        </div>
        
        <div>
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
                  <p className="text-sm text-gray-500">Full name</p>
                  <p className="font-medium">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile phone</p>
                  <p className="font-medium">{employee.mobilePhone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Place of birth</p>
                  <p className="font-medium">{employee.birthPlace || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Birthdate</p>
                  <p className="font-medium">{employee.birthDate || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{employee.gender || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital status</p>
                  <p className="font-medium">{employee.maritalStatus || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood type</p>
                  <p className="font-medium">{employee.bloodType || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-medium">{employee.religion || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EditPersonalDetailsDialog 
        open={editDialogOpen}
        employee={employee}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
      />
    </Card>
  );
};
