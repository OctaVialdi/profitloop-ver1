
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme, ThemeSettings } from "@/hooks/useTheme";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks/useOrganization";
import { Upload, Palette } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OrganizationSettings = () => {
  const { themeSettings, logoUrl, isLoading, isSaving, saveThemeSettings, uploadLogo, isAdmin } = useTheme();
  const { organization } = useOrganization();
  const [newTheme, setNewTheme] = useState<ThemeSettings>(themeSettings);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        alert('File harus berformat gambar (JPG, PNG, atau SVG)');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      uploadLogo(file);
    }
  };

  const handleColorChange = (key: keyof ThemeSettings, value: string) => {
    setNewTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveTheme = () => {
    saveThemeSettings(newTheme);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Pengaturan Organisasi</CardTitle>
            <CardDescription>Kelola pengaturan organisasi Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Akses Dibatasi</AlertTitle>
              <AlertDescription>
                Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator organisasi Anda.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-5 w-full mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Pengaturan Organisasi</h1>
        <p className="text-gray-600 mb-8">
          Sesuaikan tampilan dan identitas organisasi Anda
        </p>
        
        <Tabs defaultValue="theme" className="space-y-4">
          <TabsList>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Logo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Tema</CardTitle>
                <CardDescription>
                  Customize warna yang digunakan di aplikasi untuk organisasi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Warna Utama</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={newTheme.primary_color}
                        onChange={(e) => handleColorChange('primary_color', e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={newTheme.primary_color}
                        onChange={(e) => handleColorChange('primary_color', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Warna Sekunder</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={newTheme.secondary_color}
                        onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={newTheme.secondary_color}
                        onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Warna Aksen</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={newTheme.accent_color}
                        onChange={(e) => handleColorChange('accent_color', e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={newTheme.accent_color}
                        onChange={(e) => handleColorChange('accent_color', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sidebar_color">Warna Sidebar</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="sidebar_color"
                        type="color"
                        value={newTheme.sidebar_color}
                        onChange={(e) => handleColorChange('sidebar_color', e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={newTheme.sidebar_color}
                        onChange={(e) => handleColorChange('sidebar_color', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Pratinjau:</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-12 rounded-md flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: newTheme.primary_color }}>
                      Primary
                    </div>
                    <div className="h-12 rounded-md flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: newTheme.secondary_color }}>
                      Secondary
                    </div>
                    <div className="h-12 rounded-md flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: newTheme.accent_color }}>
                      Accent
                    </div>
                    <div className="h-12 rounded-md flex items-center justify-center text-xs border"
                      style={{ backgroundColor: newTheme.sidebar_color }}>
                      Sidebar
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveTheme} disabled={isSaving}>
                  {isSaving ? "Menyimpan..." : "Simpan Tema"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>Logo Organisasi</CardTitle>
                <CardDescription>
                  Upload logo perusahaan yang akan ditampilkan di aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {logoUrl && (
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <img 
                      src={logoUrl} 
                      alt={organization?.name || "Logo Organisasi"} 
                      className="max-h-48 object-contain mb-4"
                    />
                    <p className="text-sm text-muted-foreground">Logo Saat Ini</p>
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Upload logo dalam format JPG, PNG, atau SVG (maks. 5MB)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Mengupload..." : "Pilih File"}
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationSettings;
