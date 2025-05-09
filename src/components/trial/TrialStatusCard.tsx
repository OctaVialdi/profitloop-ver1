
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrialStatus } from "@/hooks/useTrialStatus";

interface TrialStatusCardProps {
  organizationId: string;
  onRequestExtension?: () => void;
}

const TrialStatusCard = ({ organizationId, onRequestExtension }: TrialStatusCardProps) => {
  const { 
    isTrialActive, 
    isTrialExpired, 
    daysLeftInTrial, 
    hours,
    minutes, 
    progress, 
    trialEndDate,
    subscriptionStatus
  } = useTrialStatus(organizationId);
  
  const navigate = useNavigate();

  // Format trial end date
  const formattedEndDate = trialEndDate 
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(trialEndDate)
    : 'Not available';

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Status Trial
          </CardTitle>
          
          {isTrialActive && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Aktif
            </Badge>
          )}
          
          {isTrialExpired && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Berakhir
            </Badge>
          )}
          
          {subscriptionStatus === 'active' && (
            <Badge className="bg-green-100 text-green-800">
              Berlangganan
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isTrialActive && (
          <>
            <div className="flex justify-between text-sm">
              <span>Trial berakhir dalam:</span>
              <span className="font-mono font-medium">
                {daysLeftInTrial}d {hours.toString().padStart(2, '0')}h {minutes.toString().padStart(2, '0')}m
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>0%</span>
                <span>100%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Berakhir pada: {formattedEndDate}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={onRequestExtension}
              >
                Minta Perpanjangan
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => navigate('/settings/subscription')}
              >
                Upgrade Sekarang
              </Button>
            </div>
          </>
        )}
        
        {isTrialExpired && (
          <>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Trial Anda telah berakhir</p>
                <p className="text-sm text-gray-600 mt-1">
                  Upgrade sekarang untuk mengakses semua fitur premium
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={onRequestExtension}
              >
                Minta Perpanjangan
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => navigate('/settings/subscription')}
              >
                Upgrade Sekarang
              </Button>
            </div>
          </>
        )}
        
        {subscriptionStatus === 'active' && (
          <>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Subscription Aktif</p>
                <p className="text-sm text-gray-600 mt-1">
                  Anda memiliki akses penuh ke semua fitur premium
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/settings/subscription')}
            >
              Kelola Subscription
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialStatusCard;
