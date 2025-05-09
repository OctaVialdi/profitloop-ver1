
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { confetti } from "@/utils/confetti"; // We'll create this utility
import { useOrganization } from "@/hooks/useOrganization";
import { Sparkles } from "lucide-react";
import { trackTrialEvent } from "@/services/analyticsService";

interface TrialMilestoneProps {
  milestoneId: string;
  // 'first-day' | '25-percent' | '50-percent' | '75-percent' | 'final-day'
  children?: React.ReactNode;
}

const TrialMilestone: React.FC<TrialMilestoneProps> = ({ milestoneId, children }) => {
  const [open, setOpen] = useState(false);
  const [hasShownMilestone, setHasShownMilestone] = useState(false);
  const { organization, isTrialActive, daysLeftInTrial } = useOrganization();
  
  const getMilestoneData = () => {
    switch (milestoneId) {
      case 'first-day':
        return {
          title: "Selamat Datang di Trial!",
          message: "Anda telah memulai periode trial 14 hari. Jelajahi semua fitur premium kami.",
          icon: "🎉",
          color: "from-blue-500 to-purple-500"
        };
      case '25-percent':
        return {
          title: "25% Trial Completed",
          message: "Anda telah menggunakan seperempat dari masa trial. Sudahkah Anda mencoba fitur Analytics?",
          icon: "📊",
          color: "from-green-500 to-blue-500"
        };
      case '50-percent':
        return {
          title: "Setengah Perjalanan!",
          message: "Anda berada di tengah masa trial. Bagaimana pengalaman Anda dengan fitur premium kami?",
          icon: "🏆",
          color: "from-yellow-500 to-orange-500" 
        };
      case '75-percent':
        return {
          title: "75% Trial Completed",
          message: "Hanya tersisa beberapa hari! Sudahkah Anda mencoba semua fitur premium?",
          icon: "⏳",
          color: "from-orange-500 to-red-500"
        };
      case 'final-day':
        return {
          title: "Hari Terakhir Trial",
          message: "Trial Anda akan berakhir dalam 24 jam. Upgrade sekarang untuk terus menggunakan semua fitur premium.",
          icon: "⚠️",
          color: "from-red-500 to-pink-500"
        };
      default:
        return {
          title: "Milestone Trial",
          message: "Anda telah mencapai milestone penting dalam masa trial Anda!",
          icon: "🎯",
          color: "from-blue-500 to-purple-500"
        };
    }
  };

  const milestoneData = getMilestoneData();
  
  useEffect(() => {
    // Check if we should show this milestone
    const shouldShowMilestone = () => {
      if (!isTrialActive || !organization || !organization.trial_start_date || !organization.trial_end_date) {
        return false;
      }
      
      const trialStartDate = new Date(organization.trial_start_date);
      const trialEndDate = new Date(organization.trial_end_date);
      const now = new Date();
      
      const totalTrialMs = trialEndDate.getTime() - trialStartDate.getTime();
      const elapsedMs = now.getTime() - trialStartDate.getTime();
      const percentComplete = (elapsedMs / totalTrialMs) * 100;
      
      const isFirstDay = (now.getTime() - trialStartDate.getTime()) < (24 * 60 * 60 * 1000);
      const isFinalDay = daysLeftInTrial <= 1;
      
      switch (milestoneId) {
        case 'first-day': return isFirstDay;
        case '25-percent': return percentComplete >= 25 && percentComplete < 30;
        case '50-percent': return percentComplete >= 50 && percentComplete < 55;
        case '75-percent': return percentComplete >= 75 && percentComplete < 80;
        case 'final-day': return isFinalDay;
        default: return false;
      }
    };
    
    // Only show each milestone once
    const alreadyShown = localStorage.getItem(`trial-milestone-${milestoneId}-shown`);
    
    if (shouldShowMilestone() && !alreadyShown && !hasShownMilestone) {
      setOpen(true);
      setHasShownMilestone(true);
      localStorage.setItem(`trial-milestone-${milestoneId}-shown`, 'true');
      
      // Track milestone view event
      if (organization?.id) {
        trackTrialEvent('milestone_viewed', organization.id, {
          milestone_id: milestoneId,
          days_left: daysLeftInTrial
        });
        
        // Show confetti for positive milestones
        if (['first-day', '50-percent'].includes(milestoneId)) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (error) {
            console.error('Failed to show confetti:', error);
          }
        }
      }
    }
  }, [milestoneId, isTrialActive, organization, hasShownMilestone, daysLeftInTrial]);

  // If there are children, render them
  if (children) {
    return (
      <>
        {children}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="p-6 text-center space-y-4">
              <div className="text-5xl mb-4">{milestoneData.icon}</div>
              <h3 className="text-xl font-bold">{milestoneData.title}</h3>
              <p className="text-gray-600">{milestoneData.message}</p>
              {daysLeftInTrial > 0 && (
                <div className="mt-2 text-sm font-semibold text-blue-600">
                  {daysLeftInTrial === 1 ? "1 hari tersisa" : `${daysLeftInTrial} hari tersisa`}
                </div>
              )}
              
              <div className="pt-4">
                <a 
                  href="/settings/subscription" 
                  onClick={() => {
                    if (organization?.id) {
                      trackTrialEvent('milestone_upgrade_click', organization.id, {
                        milestone_id: milestoneId
                      });
                    }
                  }}
                  className={`inline-block px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r ${milestoneData.color} hover:shadow-lg transition-all`}
                >
                  <Sparkles className="inline-block mr-1 h-4 w-4" />
                  Lihat Semua Fitur
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // If no children, just manage the dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="p-6 text-center space-y-4">
          <div className="text-5xl mb-4">{milestoneData.icon}</div>
          <h3 className="text-xl font-bold">{milestoneData.title}</h3>
          <p className="text-gray-600">{milestoneData.message}</p>
          {daysLeftInTrial > 0 && (
            <div className="mt-2 text-sm font-semibold text-blue-600">
              {daysLeftInTrial === 1 ? "1 hari tersisa" : `${daysLeftInTrial} hari tersisa`}
            </div>
          )}
          
          <div className="pt-4">
            <a 
              href="/settings/subscription" 
              onClick={() => {
                if (organization?.id) {
                  trackTrialEvent('milestone_upgrade_click', organization.id, {
                    milestone_id: milestoneId
                  });
                }
              }}
              className={`inline-block px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r ${milestoneData.color} hover:shadow-lg transition-all`}
            >
              <Sparkles className="inline-block mr-1 h-4 w-4" />
              Lihat Semua Fitur
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrialMilestone;
