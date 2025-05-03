
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarClock, X } from "lucide-react";

interface TrialBannerAlertProps {
  countdownString: string;
  daysLeft: number;
  onDismiss: () => void;
  onSubscribe: () => void;
}

const TrialBannerAlert = ({ 
  countdownString, 
  daysLeft, 
  onDismiss, 
  onSubscribe 
}: TrialBannerAlertProps) => {
  return (
    <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex items-center justify-between bg-blue-50 border-blue-100">
      <div className="flex items-center">
        <CalendarClock className="h-4 w-4 text-blue-600 mr-2" />
        <AlertDescription className="text-blue-700 font-medium text-sm">
          {daysLeft > 0 ? (
            <>Masa trial Anda berakhir dalam <span className="font-semibold">{countdownString}</span>. </>
          ) : (
            <>Masa trial Anda telah berakhir. </>
          )}
          <Button 
            variant="link" 
            className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
            onClick={onSubscribe}
          >
            Berlangganan sekarang
          </Button>
        </AlertDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default TrialBannerAlert;
