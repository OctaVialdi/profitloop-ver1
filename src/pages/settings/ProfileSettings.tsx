
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2, Save, Key, Bell, Cookie } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { timezones } from "@/lib/timezones";

// Profile form schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
  timezone: z.string(),
});

// Password form schema with validation
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password minimal 6 karakter" }),
  newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
    .regex(/[0-9]/, { message: "Password harus mengandung angka" }),
  confirmPassword: z.string().min(1, { message: "Konfirmasi password wajib diisi" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

// Preferences schema
const preferencesSchema = z.object({
  marketingEmails: z.boolean(),
  notificationEmails: z.boolean(),
  darkMode: z.boolean(),
});

const ProfileSettings = () => {
  const { userProfile, refreshData } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    marketingEmails: false,
    notificationEmails: true,
    darkMode: false,
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      timezone: "Asia/Jakarta",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Preferences form
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      marketingEmails: false,
      notificationEmails: true,
      darkMode: false,
    },
  });

  // Load user data
  useEffect(() => {
    if (userProfile) {
      // Load profile data
      profileForm.reset({
        fullName: userProfile.full_name || "",
        timezone: userProfile.timezone || "Asia/Jakarta",
      });

      // Load preferences
      if (userProfile.preferences) {
        const userPrefs = userProfile.preferences as any;
        setPreferences({
          marketingEmails: userPrefs.marketing_emails || false,
          notificationEmails: userPrefs.notification_emails || true,
          darkMode: userPrefs.dark_mode || false,
        });

        preferencesForm.reset({
          marketingEmails: userPrefs.marketing_emails || false,
          notificationEmails: userPrefs.notification_emails || true,
          darkMode: userPrefs.dark_mode || false,
        });
      }
    }
  }, [userProfile]);

  // Update profile handler
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          timezone: values.timezone
        })
        .eq("id", userProfile?.id);

      if (error) throw error;
      
      toast.success("Profil berhasil diperbarui");
      refreshData(); // Refresh user data after update
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  // Update password handler
  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsPasswordLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) throw error;
      
      toast.success("Password berhasil diperbarui");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Gagal memperbarui password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Update preferences handler
  const onPreferencesSubmit = async (values: z.infer<typeof preferencesSchema>) => {
    try {
      setIsLoading(true);
      
      const newPreferences = {
        marketing_emails: values.marketingEmails,
        notification_emails: values.notificationEmails,
        dark_mode: values.darkMode
      };
      
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: newPreferences
        })
        .eq("id", userProfile?.id);

      if (error) throw error;
      
      toast.success("Preferensi berhasil diperbarui");
      refreshData(); // Refresh user data after update
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error(error.message || "Gagal memperbarui preferensi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan Profil</h1>
      
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Kelola informasi akun dan profil Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona Waktu</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih zona waktu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Zona waktu akan digunakan untuk menampilkan waktu yang relevan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>
            Kelola keamanan akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Saat Ini</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimal 8 karakter, termasuk satu huruf besar dan satu angka.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isPasswordLoading} className="w-full sm:w-auto">
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memperbarui...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Perbarui Password
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preferensi</CardTitle>
          <CardDescription>
            Atur preferensi penggunaan aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...preferencesForm}>
            <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={preferencesForm.control}
                  name="notificationEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Pemberitahuan Email</FormLabel>
                        <FormDescription>
                          Terima email untuk aksi penting dan pemberitahuan.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={preferencesForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Marketing</FormLabel>
                        <FormDescription>
                          Terima email tentang produk baru dan penawaran.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={preferencesForm.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Mode Gelap</FormLabel>
                        <FormDescription>
                          Gunakan tema gelap untuk aplikasi.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Preferensi
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
