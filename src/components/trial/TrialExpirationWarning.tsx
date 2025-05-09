
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, X } from "lucide-react";
import { useTrialStatus } from "@/hooks/useTrialStatus";

interface TrialExpirationWarningProps {
  organizationId: string | null;
  onDismiss?: () => void;
}

const TrialExpirationWarning = ({ organizationId, onDismiss }: TrialExpirationWarningProps) => {
  const navigate = useNavigate();
  const { isTrialActive, daysLeftInTrial, progress, isTrialExpired } = 
    useTrialStatus(organizationId || null);

  // Only show warning if trial is active but has 3 or fewer days left
  if (!isTrialActive || daysLeftInTrial > 3 || isTrialExpired) {
    return null;
  }

  // Determine color based on days left
  const progressColor = daysLeftInTrial <= 1 
    ? 'bg-red-500' 
    : daysLeftInTrial <= 2 
      ? 'bg-orange-500' 
      : 'bg-blue-500';

  return (
    <Alert className="border-b mb-0 py-2 px-4 flex flex-col sm:flex-row items-center justify-between bg-blue-50 border-blue-100 rounded-none animate-fade-in">
      <div className="flex items-center w-full">
        <CalendarClock className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
        <div className="w-full">
          <AlertDescription className="text-blue-700 font-medium text-sm">
            Masa trial Anda berakhir dalam <span className="font-semibold">{daysLeftInTrial} hari</span>.{' '}
            <Button 
              variant="link" 
              className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
              onClick={() => navigate("/settings/subscription")}
            >
              Berlangganan sekarang
            </Button>
          </AlertDescription>
          <Progress value={progress} className={`h-1.5 mt-1.5 ${progressColor}`} />
        </div>
      </div>
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 mt-2 sm:mt-0 flex-shrink-0" 
          onClick={onDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
};

export default TrialExpirationWarning;
