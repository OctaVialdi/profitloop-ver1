import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Edit, Mail, Phone, Cake, User, Activity } from "lucide-react";
import { LegacyEmployee, EmployeePersonalDetails } from "@/hooks/useEmployees";
import { employeeService } from "@/services/employeeService";
import { EditPersonalDetailsDialog } from "./edit/EditPersonalDetailsDialog";
import { ProfilePhotoUploader } from "./edit/ProfilePhotoUploader";

interface PersonalSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(employee.profile_image || "");

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handlePhotoClick = () => {
    setIsPhotoDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handlePhotoDialogClose = () => {
    setIsPhotoDialogOpen(false);
  };

  const handleDialogSave = () => {
    setIsEditDialogOpen(false);
    handleEdit("refresh");
  };

  const handlePhotoUpdate = (imageUrl: string) => {
    setProfileImage(imageUrl);
    setIsPhotoDialogOpen(false);
    handleEdit("refresh");
  };

  const renderAvatarContent = () => {
    if (profileImage) {
      return <img src={profileImage} alt={employee.name} className="h-full w-full object-cover" />;
    } else {
      return <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-xl font-semibold">
        {employee.name.charAt(0).toUpperCase()}
      </div>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            {renderAvatarContent()}
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={handlePhotoClick}
          >
            Change photo
          </Button>
        </div>
        
        {/* Profile information */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <p className="text-gray-500">{employee.jobPosition || "No position"}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleEditClick}
            >
              <Edit size={16} />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} className="flex-shrink-0" />
              <span>{employee.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} className="flex-shrink-0" />
              <span>{employee.mobilePhone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Cake size={16} className="flex-shrink-0" />
              <span>
                {employee.birthDate ? (
                  <>
                    Born {employee.birthDate}
                    {employee.birthPlace && ` in ${employee.birthPlace}`}
                  </>
                ) : (
                  "No birth information"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User size={16} className="flex-shrink-0" />
              <span>
                {employee.gender ? `${employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}` : "No gender specified"}
                {employee.maritalStatus && `, ${employee.maritalStatus.charAt(0).toUpperCase() + employee.maritalStatus.slice(1)}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Activity size={16} className="flex-shrink-0" />
              <span>{employee.bloodType ? `Blood type ${employee.bloodType}` : "No blood type"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-4 h-4 flex-shrink-0">🙏</span>
              <span>{employee.religion ? employee.religion.charAt(0).toUpperCase() + employee.religion.slice(1) : "No religion specified"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit dialog */}
      <EditPersonalDetailsDialog 
        open={isEditDialogOpen}
        employee={employee}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
      
      {/* Photo upload dialog
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <ProfilePhotoUploader 
            employeeId={employee.id}
            currentImageUrl={profileImage}
            onSuccess={handlePhotoUpdate}
          />
        </DialogContent>
      </Dialog> */}
    </Card>
  );
};
