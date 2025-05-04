
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FilesSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { uploadProfileImage } = useEmployees();
  
  // Get employee name initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be smaller than 5MB");
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsDialogOpen(true);
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadProfileImage(employee.id, selectedFile);
      toast.success("Profile image uploaded successfully");
      setIsDialogOpen(false);
      
      // Clear selected file and preview URL
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Profile Image</h2>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-40 w-40">
              {employee.profileImage ? (
                <AvatarImage src={employee.profileImage} alt={employee.name} />
              ) : null}
              <AvatarFallback className="text-3xl">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4">
              <Button onClick={() => document.getElementById('profile-image-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Profile Image
              </Button>
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={handleFileSelect}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Upload a profile picture (Max size: 5MB)
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Documents</h2>
          <EmptyDataDisplay 
            title="There is no data to display"
            description="Your files will be displayed here."
            section="files"
            handleEdit={handleEdit}
          />
        </div>
      </div>
      
      {/* Image Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open && previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          setSelectedFile(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Image</DialogTitle>
          </DialogHeader>
          
          {previewUrl && (
            <div className="flex justify-center p-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-80 object-contain rounded-md"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
