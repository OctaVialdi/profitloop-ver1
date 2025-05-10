
import { differenceInDays } from "date-fns";
import { Organization } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2 } from "lucide-react";

interface TrialBannerProps {
  organization: Organization | null;
}

export function TrialBanner({ organization }: TrialBannerProps) {
  if (!organization || organization.subscription_status !== 'trial') {
    return null;
  }

  // Adjust the calculation to ensure numeric type
  const daysLeft = organization?.trial_end_date
    ? Math.max(0, differenceInDays(
        new Date(organization.trial_end_date),
        new Date()
      ))
    : 0;

  const trialExpired = daysLeft <= 0;

  return (
    <div className={`p-3 rounded-md ${trialExpired ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {trialExpired ? (
            <CheckCircle2 className="h-5 w-5 mr-2" />
          ) : (
            <CalendarDays className="h-5 w-5 mr-2" />
          )}
          <p className="text-sm font-medium">
            {trialExpired ? (
              <>Masa uji coba Anda telah berakhir.</>
            ) : (
              <>
                Masa uji coba Anda akan berakhir dalam <strong>{daysLeft} hari</strong>.
              </>
            )}
          </p>
        </div>
        {!trialExpired && (
          <Button variant="secondary" size="sm">
            Berlangganan Sekarang
          </Button>
        )}
      </div>
    </div>
  );
}
