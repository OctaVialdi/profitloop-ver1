
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { employeeService } from "@/services/employeeService";

interface ProfilePhotoUploaderProps {
  employeeId: string;
  currentImageUrl?: string;
  employeeName?: string;
  onSuccess?: (imageUrl: string) => void;
  onPhotoUpdated?: (imageUrl: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  employeeId,
  currentImageUrl,
  employeeName,
  onSuccess,
  onPhotoUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // For now, just simulate a successful upload
      // In a real implementation, you would upload the file to storage
      // and get a URL back
      const fakeImageUrl = URL.createObjectURL(file);
      
      // Update employee profile with the new image URL
      await employeeService.updateEmployeeProfileImage(employeeId, fakeImageUrl);
      
      if (onSuccess) {
        onSuccess(fakeImageUrl);
      }
      
      if (onPhotoUpdated) {
        onPhotoUpdated(fakeImageUrl);
      }
      
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {currentImageUrl && (
        <div className="mb-4">
          <img 
            src={currentImageUrl} 
            alt={employeeName ? `${employeeName}'s profile` : "Profile"} 
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}
      
      <Button
        variant="outline"
        className="gap-2"
        disabled={isUploading}
        onClick={() => document.getElementById("photo-upload")?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Photo
          </>
        )}
      </Button>
      
      <input 
        type="file" 
        id="photo-upload" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
};
