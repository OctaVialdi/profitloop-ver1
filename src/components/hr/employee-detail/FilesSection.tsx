
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { toast } from "sonner";
import { employeeService } from "@/services/employeeService";

interface FilesSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB"
      });
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await employeeService.uploadProfileImage(employee.id, file);
      
      if (imageUrl) {
        toast.success("Profile image updated");
        // Force refresh to show the new image
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Files & Documents</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {employee.profile_image ? (
                <img 
                  src={employee.profile_image} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  No image
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label htmlFor="profile-image-upload">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isUploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload new image'}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Maximum file size: 5MB
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <EmptyDataDisplay 
            title="No documents available"
            description="Upload important documents like contracts, certificates, etc."
            section="files"
            handleEdit={handleEdit}
          />
        </div>
      </div>
    </Card>
  );
};
