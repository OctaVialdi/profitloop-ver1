
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ProfileDropdown from "@/components/ProfileDropdown";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import NotificationSystem from "@/components/NotificationSystem";
import TrialBanner from "@/components/TrialBanner";
import { useOrganization } from "@/hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "@/services/subscriptionService";

export default function DashboardLayout() {
  const { organization, isTrialActive, isTrialExpired, refreshData } = useOrganization();
  const [checkedTrialStatus, setCheckedTrialStatus] = useState(false);

  // Check trial status on component mount
  useEffect(() => {
    const verifyTrialStatus = async () => {
      if (!organization || checkedTrialStatus) return;

      try {
        // Check and update trial status if needed
        if (organization.id && (isTrialActive || isTrialExpired)) {
          const updated = await checkAndUpdateTrialStatus(organization.id);
          if (updated) {
            // If trial status was updated, refresh organization data
            await refreshData();
          }
        }
        setCheckedTrialStatus(true);
      } catch (error) {
        console.error("Error verifying trial status:", error);
      }
    };

    verifyTrialStatus();
  }, [organization, isTrialActive, isTrialExpired, checkedTrialStatus, refreshData]);

  return (
    <div className="flex flex-col min-h-screen">
      <TrialBanner />
      <header className="bg-white border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <OrganizationSwitcher />
          <div className="flex items-center gap-4">
            <NotificationSystem />
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
}
