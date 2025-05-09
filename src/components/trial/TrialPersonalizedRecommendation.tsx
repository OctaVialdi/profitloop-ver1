
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { trackTrialEvent } from '@/services/analyticsService';
import { Progress } from "@/components/ui/progress";
import { formatTrialCountdown } from "@/utils/organizationUtils";

interface RecommendedFeature {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

interface TrialPersonalizedRecommendationProps {
  className?: string;
}

const TrialPersonalizedRecommendation: React.FC<TrialPersonalizedRecommendationProps> = ({ className = "" }) => {
  const { organization, isTrialActive, daysLeftInTrial } = useOrganization();
  const [recommendedFeatures, setRecommendedFeatures] = useState<RecommendedFeature[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calculate trial progress percentage
  const calculateTrialProgress = () => {
    if (!organization?.trial_start_date || !organization?.trial_end_date) return 100;
    
    const start = new Date(organization.trial_start_date).getTime();
    const end = new Date(organization.trial_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Return remaining percentage (100 to 0)
    return Math.max(0, Math.min(100, 100 - (elapsed / totalDuration * 100)));
  };

  // Progress color based on remaining time
  const getProgressColorClass = () => {
    if (daysLeftInTrial <= 1) return 'trial-progress-low';
    if (daysLeftInTrial <= 3) return 'trial-progress-medium';
    return 'trial-progress-high';
  };
  
  // Default recommendations based on trial progress
  useEffect(() => {
    if (!isTrialActive) {
      setRecommendedFeatures([]);
      setLoading(false);
      return;
    }

    // In a real app, these could come from an API based on user behavior
    const defaultRecommendations: RecommendedFeature[] = [
      {
        id: 'hr-recruitment',
        name: 'Rekrutmen HR',
        description: 'Kelola proses rekrutmen dan kandidat secara efisien',
        path: '/hr/recruitment/Dashboard',
        icon: <Calendar className="h-5 w-5 text-blue-500" />
      },
      {
        id: 'operations-dashboard',
        name: 'Dashboard Operasional',
        description: 'Lihat performa operasional bisnis Anda secara real-time',
        path: '/operations/Dashboard',
        icon: <Clock className="h-5 w-5 text-green-500" />
      }
    ];
    
    // Filter recommendations based on trial progress
    const trialProgress = calculateTrialProgress();
    let filteredRecommendations = [...defaultRecommendations];
    
    // Prioritize specific features based on time left in trial
    if (daysLeftInTrial <= 3) {
      // Prioritize high-value features when trial is almost over
      filteredRecommendations = defaultRecommendations.filter(f => 
        ['operations-dashboard'].includes(f.id)
      );
    }
    
    setRecommendedFeatures(filteredRecommendations.slice(0, 2)); // Only show up to 2
    setLoading(false);
    
    // Track that recommendations were shown
    if (organization?.id) {
      trackTrialEvent('recommendations_viewed', organization.id, {
        days_left: daysLeftInTrial,
        features_shown: filteredRecommendations.map(f => f.id).join(',')
      });
    }
  }, [isTrialActive, daysLeftInTrial, organization]);

  const handleFeatureClick = (featureId: string) => {
    if (organization?.id) {
      trackTrialEvent('recommendation_clicked', organization.id, {
        feature_id: featureId,
        days_left: daysLeftInTrial
      });
    }
  };
  
  if (!isTrialActive || recommendedFeatures.length === 0) {
    return null;
  }
  
  return (
    <Card className={`border-blue-100 bg-blue-50/50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          Rekomendasi Fitur Trial
        </CardTitle>
        <CardDescription>
          Maksimalkan masa trial Anda dengan menjelajahi fitur-fitur premium ini:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center text-blue-700">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Trial berakhir:
              </span>
              <span className="font-bold text-blue-800">{formatTrialCountdown(organization?.trial_end_date)}</span>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={calculateTrialProgress()} 
                className={`h-2 ${getProgressColorClass()}`} 
              />
              <div className="flex justify-between text-xs text-blue-600">
                <span>{daysLeftInTrial === 1 ? "1 hari tersisa" : `${daysLeftInTrial} hari tersisa`}</span>
                <a href="/settings/subscription" className="underline hover:text-blue-800">
                  Upgrade
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            {recommendedFeatures.map((feature) => (
              <a 
                key={feature.id}
                href={feature.path}
                onClick={() => handleFeatureClick(feature.id)}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-md mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">{feature.name}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-500" />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrialPersonalizedRecommendation;
