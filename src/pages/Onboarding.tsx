import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { businessFieldOptions, employeeCountOptions } from '@/data/formOptions';
import { registrationService } from '@/services/registrationService';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';

const Onboarding = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [businessField, setBusinessField] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuthState();

  useEffect(() => {
    if (!loading && !user) {
      // If not loading and no user, redirect to login
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName) {
      toast.error("Nama organisasi harus diisi");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          business_field: businessField,
          employee_count: employeeCount,
        })
        .select('id')
        .single();
      
      if (orgError) throw orgError;
      
      // Update user's profile with the organization ID
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: org.id,
          role: 'super_admin' // The creator is always a super admin
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Update user metadata with organization ID for quick access
      const { error: userError } = await supabase.auth.updateUser({
        data: { organization_id: org.id }
      });
      
      if (userError) throw userError;
      
      // Set up trial period for the new organization
      const trialSetup = await registrationService.setupTrialPeriod(org.id);
      
      if (trialSetup) {
        // Track trial started event
        subscriptionAnalyticsService.trackTrialStarted(org.id);
        
        toast.success("Organisasi berhasil dibuat dan trial 14 hari dimulai!");
      } else {
        toast.warning("Organisasi berhasil dibuat tetapi trial tidak dapat dimulai. Silakan hubungi dukungan.");
      }
      
      // Navigate to dashboard after successful onboarding
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast.error("Gagal membuat organisasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Selamat Datang!</CardTitle>
          <CardDescription className="text-center">
            Isi form di bawah untuk membuat organisasi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Nama Organisasi</Label>
              <Input
                type="text"
                id="organizationName"
                placeholder="Nama Organisasi Anda"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="businessField">Bidang Bisnis</Label>
              <Select onValueChange={setBusinessField} defaultValue={businessField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Bidang Bisnis" />
                </SelectTrigger>
                <SelectContent>
                  {businessFieldOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
              <Select onValueChange={setEmployeeCount} defaultValue={employeeCount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jumlah Karyawan" />
                </SelectTrigger>
                <SelectContent>
                  {employeeCountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Buat Organisasi"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
