
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";
import { Employee } from "@/services/employeeService";

interface EditProfilePhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onPhotoUpdated: (newPhotoUrl: string) => void;
}

export const EditProfilePhotoDialog: React.FC<EditProfilePhotoDialogProps> = ({
  isOpen,
  onClose,
  employee,
  onPhotoUpdated,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ProfilePhotoUploader
            employeeId={employee.id}
            currentImageUrl={employee.profile_image}
            employeeName={employee.name}
            onPhotoUpdated={onPhotoUpdated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
