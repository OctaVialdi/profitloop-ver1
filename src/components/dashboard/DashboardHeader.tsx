
import React from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import SubscriptionStatusBadge from '@/components/subscription/SubscriptionStatusBadge';
import { Button } from '@/components/ui/button';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  const { hasPaidSubscription, isTrialActive } = useOrganization();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <SubscriptionStatusBadge size="md" />
        
        {!hasPaidSubscription && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings/subscription/faq">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>FAQ Langganan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {!hasPaidSubscription && (
          <Button asChild size="sm" className={isTrialActive ? "bg-amber-500 hover:bg-amber-600" : ""}>
            <Link to="/settings/subscription">
              {isTrialActive ? 'Aktifkan Langganan' : 'Berlangganan'}
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
