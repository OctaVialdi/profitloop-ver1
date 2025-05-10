
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureBucketExists } from "@/integrations/supabase/storage";

interface ProfilePhotoUploaderProps {
  userId: string;
  currentPhotoUrl?: string | null;
  fullName: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  userId,
  currentPhotoUrl,
  fullName,
  onPhotoUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Pilih file gambar');
      return;
    }
    
    // Validate file size (max 2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Ensure the 'profile_photos' bucket exists
      await ensureBucketExists('profile_photos', true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Gagal mendapatkan URL foto profil');
      }
      
      // Update the user's profile with the new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          profile_image: urlData.publicUrl
        })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Foto profil berhasil diperbarui');
      onPhotoUpdated(urlData.publicUrl);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Gagal mengupload foto profil');
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
            <AvatarImage src={currentPhotoUrl} alt={fullName} />
          ) : (
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
              {getInitials(fullName)}
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
              {isUploading ? 'Mengupload...' : 'Upload foto'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};
