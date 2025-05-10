
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { toast } from "sonner";

const TrialBanner = () => {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isPremiumPlan, setIsPremiumPlan] = useState(false);
  const navigate = useNavigate();
  const { initiateCheckout, isLoading } = useStripeCheckout();

  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        // Get user organization
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .single();
        
        if (!profileData?.organization_id) return;
        
        setOrganizationId(profileData.organization_id);
        
        // Get organization details
        const { data: orgData } = await supabase
          .from('organizations')
          .select(`
            trial_end_date, 
            trial_expired, 
            subscription_status,
            subscription_plan_id
          `)
          .eq('id', profileData.organization_id)
          .single();
        
        if (!orgData) return;
        
        // Check if on premium plan
        setIsPremiumPlan(orgData.subscription_status === 'active');
        
        // If subscription is active, no need to show trial banner
        if (orgData.subscription_status === 'active') return;
        
        // Check if trial is expired
        if (orgData.trial_expired) {
          setIsTrialExpired(true);
          setIsTrialActive(false);
          return;
        }
        
        // Check if trial is active
        if (orgData.trial_end_date) {
          const trialEndDate = new Date(orgData.trial_end_date);
          const now = new Date();
          
          if (trialEndDate > now) {
            setIsTrialActive(true);
            
            // Calculate days left
            const diffTime = trialEndDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays);
          } else {
            setIsTrialExpired(true);
            setIsTrialActive(false);
          }
        }
      } catch (error) {
        console.error("Error checking trial status:", error);
      }
    };
    
    checkTrialStatus();
    
    // Check every minute
    const intervalId = setInterval(checkTrialStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Don't render if no organization, subscription is active, or banner is dismissed
  if (!organizationId || isPremiumPlan || isBannerDismissed) return null;
  
  if (isTrialActive) {
    // Only show for less than 7 days remaining
    if (daysLeft > 7) return null;
    
    return (
      <div className="bg-blue-50 border-b border-blue-100 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Clock size={16} />
          <span>
            Trial Anda akan berakhir dalam <strong>{daysLeft} hari</strong>.{" "}
            <span className="hidden md:inline">
              Berlangganan sekarang untuk terus menggunakan semua fitur.
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="default" 
            className="text-xs bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/settings/subscription')}
          >
            Berlangganan
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs text-gray-500 h-7 w-7 p-0"
            onClick={() => setIsBannerDismissed(true)}
          >
            <X size={14} />
          </Button>
        </div>
      </div>
    );
  }
  
  if (isTrialExpired) {
    return (
      <div className="bg-amber-50 border-b border-amber-100 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <AlertTriangle size={16} />
          <span>
            Trial Anda telah berakhir.{" "}
            <span className="hidden md:inline">
              Berlangganan untuk melanjutkan menggunakan semua fitur.
            </span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="text-xs bg-amber-600 hover:bg-amber-700"
            onClick={() => {
              // Direct to checkout with Standard plan
              initiateCheckout('standard_plan').catch(error => {
                console.error('Error initiating checkout:', error);
                toast.error('Gagal memulai proses checkout');
              });
            }}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Berlangganan Sekarang"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-amber-200 text-amber-700"
            onClick={() => navigate('/settings/subscription')}
          >
            Lihat Paket
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default TrialBanner;
