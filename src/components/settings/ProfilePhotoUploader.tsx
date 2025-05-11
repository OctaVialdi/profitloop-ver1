
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserCircle, Upload, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ProfilePhotoUploaderProps {
  userId: string;
  currentPhotoUrl: string | null | undefined;
  fullName: string;
  onPhotoUpdated: (photoUrl: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  userId,
  currentPhotoUrl,
  fullName,
  onPhotoUpdated,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!userId) {
    return null;
  }

  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar. Maksimum 2MB");
      return;
    }

    // File type validation
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);
    try {
      // Create a unique file path in the bucket
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, selectedFile);

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(filePath);

      // Call the callback with the new URL
      onPhotoUpdated(urlData.publicUrl);
      toast.success("Foto profil berhasil diperbarui");

      // Clean up the preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setSelectedFile(null);
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentPhotoUrl) return;

    setIsDeleting(true);
    try {
      // Update the profile to remove the photo URL
      const { error } = await supabase.rpc('update_user_profile_with_password', {
        user_id: userId,
        profile_image: null,
        full_name: fullName,
        timezone: null,
        preferences: null,
        current_password: null,
        new_password: null
      });

      if (error) throw error;

      // Call the callback with null URL
      onPhotoUpdated("");
      toast.success("Foto profil berhasil dihapus");
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast.error(error.message || "Gagal menghapus foto");
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <Avatar className="w-32 h-32 border-4 border-gray-100 shadow-sm">
        <AvatarImage 
          src={currentPhotoUrl || undefined} 
          alt={fullName} 
          className="object-cover"
        />
        <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
          {initials || <UserCircle size={40} />}
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2 mt-4">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={triggerFileInput}
          disabled={isUploading || isDeleting}
        >
          <Upload className="w-4 h-4 mr-2" />
          Unggah Foto
        </Button>

        {currentPhotoUrl && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDeletePhoto}
            disabled={isUploading || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash className="w-4 h-4 mr-2" />
            )}
            Hapus
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unggah Foto Profil Baru</DialogTitle>
            <DialogDescription>
              Pratinjau foto profil Anda sebelum mengunggah.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            {previewUrl && (
              <Avatar className="w-40 h-40 border-4 border-gray-100 shadow-sm">
                <AvatarImage src={previewUrl} alt="Preview" className="object-cover" />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }
                setSelectedFile(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                "Simpan Foto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
