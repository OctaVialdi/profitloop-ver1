
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  buttonText?: string;
  maxSizeMB?: number;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export function FileUpload({ 
  onUpload, 
  accept = "image/*", 
  buttonText = "Upload File", 
  maxSizeMB = 5,
  className = "",
  variant = "outline"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      // Call the upload function passed as prop
      await onUpload(file);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      // Clear preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const clearPreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      {previewUrl && previewUrl.startsWith('data:image') ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-md max-h-40 max-w-xs object-cover"
          />
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 rounded-full bg-gray-200 p-1 hover:bg-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <Button
          variant={variant}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {isUploading ? "Uploading..." : buttonText}
        </Button>
      )}
    </div>
  );
}
