
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const businessFields = [
  { value: "it", label: "IT" },
  { value: "retail", label: "Retail" },
  { value: "education", label: "Pendidikan" },
  { value: "healthcare", label: "Kesehatan" },
  { value: "finance", label: "Keuangan" },
  { value: "manufacturing", label: "Manufaktur" },
  { value: "other", label: "Lainnya" }
];

const OrganizationSetup = () => {
  const [name, setName] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Get default subscription plan (Basic)
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'Basic')
        .single();
      
      if (planError) {
        throw planError;
      }
      
      // Set trial_end_date to 30 days from now
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      
      // Create new organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name,
          business_field: businessField,
          employee_count: employeeCount ? parseInt(employeeCount) : null,
          address,
          phone,
          subscription_plan_id: planData.id,
          trial_end_date: trialEndDate.toISOString(),
        })
        .select()
        .single();
      
      if (orgError) {
        throw orgError;
      }
      
      // Update user profile to link with organization as super_admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id,
          role: 'super_admin'
        })
        .eq('id', user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      toast.success("Organisasi berhasil dibuat!");
      navigate("/welcome");
    } catch (error: any) {
      console.error("Organization setup error:", error);
      toast.error(error.message || "Gagal membuat organisasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Pengaturan Organisasi</CardTitle>
          <CardDescription className="text-center">
            Lengkapi informasi organisasi Anda untuk mulai menggunakan aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Perusahaan <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="PT. Nama Perusahaan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessField">Bidang Bisnis</Label>
              <Select value={businessField} onValueChange={setBusinessField}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bidang bisnis" />
                </SelectTrigger>
                <SelectContent>
                  {businessFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
              <Input
                id="employeeCount"
                type="number"
                placeholder="Masukkan jumlah karyawan"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Perusahaan</Label>
              <Textarea
                id="address"
                placeholder="Alamat lengkap perusahaan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="+62xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Buat Organisasi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSetup;
