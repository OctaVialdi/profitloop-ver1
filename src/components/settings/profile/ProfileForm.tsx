
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfilePhotoUploader } from "@/components/settings/ProfilePhotoUploader";
import { UserProfile } from "@/types/organization";

interface ProfileFormProps {
  user: any;
  userProfile: UserProfile | null;
  refreshData: () => Promise<void>;
}

interface ProfileFormData {
  fullName: string;
  email: string;
  timezone: string;
  darkMode: boolean;
  profileImage?: string | null;
}

export const ProfileForm = ({ user, userProfile, refreshData }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: userProfile?.full_name || "",
    email: userProfile?.email || "",
    timezone: userProfile?.timezone || "Asia/Jakarta",
    darkMode: userProfile?.preferences?.dark_mode || false,
    profileImage: userProfile?.profile_image || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(formData);
  };

  const handleProfilePhotoUpdated = (newPhotoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      profileImage: newPhotoUrl
    }));
    refreshData();
  };

  const updateUserProfile = async (formData: ProfileFormData) => {
    setIsSaving(true);
    
    try {
      // Convert timezone to Asia/Jakarta format if needed
      let timezone = formData.timezone || 'Asia/Jakarta';
      
      // Make sure the timezone is properly formatted
      if (!timezone.includes('/') && timezone.includes('+')) {
        // Convert from GMT+0700 format to IANA timezone
        timezone = 'Asia/Jakarta'; // Default for Indonesia/GMT+7
      }
      
      const { data, error } = await supabase.rpc('update_user_profile_with_password', {
        user_id: user?.id,
        full_name: formData.fullName,
        timezone: timezone,
        preferences: {
          ...(userProfile?.preferences || {}),
          dark_mode: formData.darkMode
        },
        profile_image: formData.profileImage,
        current_password: null,  // Not updating password
        new_password: null       // Not updating password
      });
      
      if (error) throw error;
      
      toast.success("Profil berhasil diperbarui");
      refreshData();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const timezones = [
    { value: "Asia/Jakarta", label: "Jakarta (GMT+7)" },
    { value: "Asia/Makassar", label: "Makassar (GMT+8)" },
    { value: "Asia/Jayapura", label: "Jayapura (GMT+9)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Profil</CardTitle>
        <CardDescription>Atur informasi profil Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <ProfilePhotoUploader 
              userId={user?.id || ''}
              currentPhotoUrl={formData.profileImage}
              fullName={formData.fullName}
              onPhotoUpdated={handleProfilePhotoUpdated}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="grid gap-4 w-full md:w-2/3">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Zona Waktu</Label>
              <Select 
                value={formData.timezone} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih zona waktu" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="darkMode"
                name="darkMode"
                checked={formData.darkMode}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, darkMode: checked }))}
              />
              <Label htmlFor="darkMode">Mode Gelap</Label>
            </div>
            <Button type="submit" disabled={isSaving} className="w-full md:w-auto md:self-end mt-2">
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
