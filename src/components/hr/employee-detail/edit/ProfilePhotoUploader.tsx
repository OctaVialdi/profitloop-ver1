
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { updateEmployeeProfileImage } from "@/services/employeeService";

interface ProfilePhotoUploaderProps {
  employeeId: string;
  currentPhotoUrl?: string | null;
  employeeName: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  employeeId,
  currentPhotoUrl,
  employeeName,
  onPhotoUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const imageUrl = await updateEmployeeProfileImage(employeeId, file);
      
      if (imageUrl) {
        toast.success('Profile photo updated successfully');
        onPhotoUpdated(imageUrl);
      } else {
        throw new Error('Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="w-32 h-32 border-2 border-gray-200">
          {currentPhotoUrl ? (
            <AvatarImage src={currentPhotoUrl} alt={employeeName} />
          ) : (
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
              {getInitials(employeeName)}
            </AvatarFallback>
          )}
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <div>
        <input
          type="file"
          id="profile-photo-input"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="profile-photo-input">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload photo'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};
