import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfilePhotoUploader } from "@/components/settings/ProfilePhotoUploader";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";

interface ProfileFormData {
  fullName: string;
  email: string;
  timezone: string;
  darkMode: boolean;
  profileImage?: string | null;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, deleteAccount, isDeleting, signOutFromAllSessions } = useAuth();
  const { userProfile, refreshData } = useOrganization();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: userProfile?.full_name || "",
    email: userProfile?.email || "",
    timezone: userProfile?.timezone || "Asia/Jakarta",
    darkMode: userProfile?.preferences?.dark_mode || false,
    profileImage: userProfile?.profile_image || null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [expectedDeleteConfirmation, setExpectedDeleteConfirmation] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.full_name || "",
        email: userProfile.email || "",
        timezone: userProfile.timezone || "Asia/Jakarta",
        darkMode: userProfile.preferences?.dark_mode || false,
        profileImage: userProfile.profile_image || null,
      });
      
      // Set the expected delete confirmation text
      if (userProfile.full_name) {
        setExpectedDeleteConfirmation(`hapus akun profile ${userProfile.full_name}`);
      }
    }
  }, [userProfile]);

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

  // Update the updateUserProfile function to handle profile image
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
        profile_image: formData.profileImage, // Add profile image to the function call
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

  const handleConfirmDelete = () => {
    // Verifikasi bahwa teks konfirmasi cocok
    if (deleteConfirmation.toLowerCase() === expectedDeleteConfirmation.toLowerCase()) {
      deleteAccount();
      setDeleteDialogOpen(false);
    } else {
      toast.error("Teks konfirmasi tidak cocok. Silakan ketik dengan benar.");
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteConfirmation("");
    setDeleteDialogOpen(true);
  };

  const timezones = [
    { value: "Asia/Jakarta", label: "Jakarta (GMT+7)" },
    { value: "Asia/Makassar", label: "Makassar (GMT+8)" },
    { value: "Asia/Jayapura", label: "Jayapura (GMT+9)" },
  ];

  const isConfirmationCorrect = deleteConfirmation.toLowerCase() === expectedDeleteConfirmation.toLowerCase();

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="authentication">Autentikasi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
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
                onClick={handleDeleteDialogOpen}
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Hapus Akun"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Autentikasi</CardTitle>
              <CardDescription>Perubahan pada autentikasi akan berlaku untuk semua akun Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email-auth">Email</Label>
                <Input
                  type="email"
                  id="email-auth"
                  value={formData.email}
                  disabled
                />
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Ubah Password</h3>
                <PasswordChangeForm />
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Keluar dari Semua Sesi Aktif</h3>
                    <p className="text-sm text-muted-foreground">Paksa logout dari semua perangkat dan sesi Anda</p>
                  </div>
                  <Button variant="outline" onClick={signOutFromAllSessions}>
                    Keluar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="w-5 h-5 mr-2" />
              Konfirmasi Hapus Akun
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Akun Anda beserta semua data akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm font-medium text-gray-900">Apa yang akan terjadi setelah akun dihapus:</p>
            <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
              <li>Anda akan kehilangan akses ke semua data dan informasi akun</li>
              <li>Jika Anda adalah admin terakhir, organisasi Anda juga akan dihapus</li>
              <li>Anda tidak dapat memulihkan akun setelah dihapus</li>
            </ul>
            
            <div className="mt-4">
              <Label htmlFor="delete-confirmation" className="text-destructive font-medium">
                Untuk konfirmasi, ketik "hapus akun profile {formData.fullName}"
              </Label>
              <Input
                id="delete-confirmation"
                className="mt-2"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={`hapus akun profile ${formData.fullName}`}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting || !isConfirmationCorrect}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus Akun Permanen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
