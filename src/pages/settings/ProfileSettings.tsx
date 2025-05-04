
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormData {
  fullName: string;
  email: string;
  timezone: string;
  darkMode: boolean;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile, refreshData } = useOrganization();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: userProfile?.full_name || "",
    email: userProfile?.email || "",
    timezone: userProfile?.timezone || "Asia/Jakarta",
    darkMode: userProfile?.preferences?.dark_mode || false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.full_name || "",
        email: userProfile.email || "",
        timezone: userProfile.timezone || "Asia/Jakarta",
        darkMode: userProfile.preferences?.dark_mode || false,
      });
    }
  }, [userProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    
    if (target.type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(formData);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      if (!user) {
        toast.error("Tidak ada pengguna yang terautentikasi.");
        return;
      }

      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        console.error("Error deleting user:", error);
        toast.error("Gagal menghapus akun. Silakan coba lagi.");
      } else {
        toast.success("Akun berhasil dihapus.");
        await signOut();
        navigate("/auth/login");
      }
    } catch (err: any) {
      console.error("Error deleting account:", err);
      toast.error(err.message || "Terjadi kesalahan saat menghapus akun.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Update the timezone handling in the updateUserProfile function
  const updateUserProfile = async (formData: ProfileFormData) => {
    setIsSaving(true);
    
    try {
      // Convert timezone to Asia/Jakarta format if needed
      let timezone = formData.timezone || 'Asia/Jakarta';
      
      // Make sure the timezone is properly formatted
      if (!timezone.includes('/') && timezone.includes('+')) {
        // Convert from GMT+0700 format to IANA timezone
        // This is a simplified example - you'd need more comprehensive mapping
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
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Profil</CardTitle>
          <CardDescription>Atur informasi profil Anda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
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
              <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
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
              <Label htmlFor="darkMode">Mode Gelap</Label>
              <Switch
                id="darkMode"
                name="darkMode"
                checked={formData.darkMode}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, darkMode: checked }))}
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Hapus Akun</CardTitle>
          <CardDescription>
            Setelah Anda menghapus akun, tidak ada jalan untuk kembali. Harap
            dipastikan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus Akun"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
