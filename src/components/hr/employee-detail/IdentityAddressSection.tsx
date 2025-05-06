
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import { LegacyEmployee, EmployeeIdentityAddress } from "@/hooks/useEmployees";
import { employeeService } from "@/services/employeeService";
import { EditIdentityAddressDialog } from "./edit/EditIdentityAddressDialog";

interface IdentityAddressSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleDialogSave = () => {
    setIsEditDialogOpen(false);
    handleEdit("refresh");
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Identity & Address</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleEditClick}
          >
            <EditIcon size={16} />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">NIK (ID Number)</p>
            <p className="font-medium">{employee.nik || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport Number</p>
            <p className="font-medium">{employee.passportNumber || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport Expiry</p>
            <p className="font-medium">{employee.passportExpiry || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Postal Code</p>
            <p className="font-medium">{employee.postalCode || "-"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Citizen ID Address</p>
            <p className="font-medium">{employee.citizenAddress || "-"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Residential Address</p>
            <p className="font-medium">{employee.address || "-"}</p>
          </div>
        </div>
      </Card>

      <EditIdentityAddressDialog
        open={isEditDialogOpen}
        employee={employee}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </>
  );
};
