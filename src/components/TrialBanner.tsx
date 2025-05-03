
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const location = useLocation();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  
  // Get trial information
  useEffect(() => {
    if (isAuthPage || isDismissed) return;
    
    const fetchTrialInfo = async () => {
      // Get current user organization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();
        
      if (!profileData?.organization_id) return;
      
      setOrganizationId(profileData.organization_id);
      
      // Get organization trial information
      const { data: orgData } = await supabase
        .from('organizations')
        .select('trial_end_date, trial_expired')
        .eq('id', profileData.organization_id)
        .single();
        
      if (!orgData || orgData.trial_expired) {
        setDaysLeft(0);
        return;
      }
      
      if (orgData.trial_end_date) {
        const endDate = new Date(orgData.trial_end_date);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
      }
    };
    
    fetchTrialInfo();
  }, [isAuthPage, isDismissed]);
  
  if (isAuthPage || isDismissed || daysLeft === null || daysLeft > 14) return null;
  
  return (
    <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex items-center justify-between bg-blue-50 border-blue-100">
      <div className="flex items-center">
        <CalendarClock className="h-4 w-4 text-blue-600 mr-2" />
        <AlertDescription className="text-blue-700 font-medium text-sm">
          {daysLeft > 0 ? (
            <>Masa trial Anda berakhir dalam <span className="font-semibold">{daysLeft} hari</span>. </>
          ) : (
            <>Masa trial Anda telah berakhir. </>
          )}
          <Button 
            variant="link" 
            className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
            onClick={() => navigate("/subscription")}
          >
            Berlangganan sekarang
          </Button>
        </AlertDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsDismissed(true)}>
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default TrialBanner;

function navigate(path: string): void {
  window.location.href = path;
}
