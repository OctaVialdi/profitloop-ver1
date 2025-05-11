
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";
import { toast } from "sonner";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUpgrade?: () => void;
  onRequest?: () => void;
  allowClose?: boolean;
  organizationName?: string;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onRequest,
  allowClose = false,
  organizationName = "your organization"
}) => {
  const navigate = useNavigate();
  const [recommendedPlan, setRecommendedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch the recommended plan (with direct payment URL) when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRecommendedPlan();
    }
  }, [isOpen]);

  const fetchRecommendedPlan = async () => {
    try {
      setLoading(true);
      // Get an active plan with direct_payment_url set, preferring the ones with price > 0
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .not('direct_payment_url', 'is', null)
        .order('price', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching recommended plan:", error);
        return;
      }

      // If we found a plan with direct_payment_url
      if (data && data.length > 0) {
        // Parse features from JSON if needed
        const plan = data[0];
        const features = typeof plan.features === 'string' 
          ? JSON.parse(plan.features) 
          : plan.features;
        
        setRecommendedPlan({
          ...plan,
          features: features as Record<string, any> | null
        });
      }
    } catch (err) {
      console.error("Error in fetchRecommendedPlan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (recommendedPlan?.direct_payment_url) {
      // If we have a recommended plan with direct payment URL, go there
      window.location.href = recommendedPlan.direct_payment_url;
    } else if (onUpgrade) {
      // Otherwise use the provided onUpgrade handler
      onUpgrade();
    } else {
      // Default fallback to plan page
      navigate('/settings/plan');
    }
  };

  const handleRequestExtension = () => {
    if (onRequest) {
      onRequest();
    } else {
      navigate('/settings/subscription/request-extension');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={allowClose ? onClose : undefined}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={e => e.preventDefault()}>
        {/* Add Close button if allowed */}
        {allowClose && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl text-center">Trial Period Expired</DialogTitle>
          <DialogDescription className="text-center">
            Your trial period for {organizationName} has ended. To continue using all features,
            please upgrade to one of our subscription plans.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Upgrading provides you with continued access to all features and premium support.
            You can also request a trial extension if you need more time to evaluate.
          </p>
          
          {recommendedPlan && (
            <div className="mt-4 p-4 border rounded-md bg-primary/5">
              <h4 className="font-semibold text-center mb-2">Recommended Plan</h4>
              <div className="flex justify-between items-center mb-2">
                <span>{recommendedPlan.name}</span>
                <span className="font-bold">
                  {recommendedPlan.price_per_member 
                    ? `${recommendedPlan.price_per_member}/user/month` 
                    : `${recommendedPlan.price}/month`}
                </span>
              </div>
              {recommendedPlan.features && Object.keys(recommendedPlan.features).length > 0 && (
                <ul className="text-sm space-y-1 my-2">
                  {Object.entries(recommendedPlan.features).slice(0, 3).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <span className="text-xs mr-2">•</span>
                      <span>{key}: {value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleUpgrade} className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Upgrade Now"}
          </Button>
          <Button onClick={handleRequestExtension} variant="outline" className="w-full">
            Request Trial Extension
          </Button>
          {allowClose && (
            <Button onClick={onClose} variant="ghost" className="w-full">
              I'll Decide Later
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
