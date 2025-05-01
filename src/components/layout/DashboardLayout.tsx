
import { ReactNode } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAppTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { 
  SidebarProviderWithTooltip as SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import your sidebar navigation component
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { organization, userProfile, isLoading, isAdmin, isSuperAdmin } = useOrganization();
  const { logoUrl } = useAppTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar
          organization={organization}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          logoUrl={logoUrl}
          currentPath={location.pathname}
        />
        
        {/* Main content */}
        <SidebarInset>
          {/* Top navigation */}
          <header className="bg-white border-b sticky top-0 z-10">
            <div className="px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2">
                  {logoUrl ? (
                    <Avatar className="h-8 w-8 hidden md:flex">
                      <AvatarImage src={logoUrl} alt={organization?.name || "Logo"} />
                      <AvatarFallback>
                        {organization?.name?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <span className="text-xl font-semibold text-blue-600">
                    {organization?.name || "Multi-Tenant"}
                  </span>
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <OrganizationSwitcher />
                <NotificationSystem />
                <ProfileDropdown />
              </div>
            </div>
          </header>
          
          {/* Page content - removed ScrollArea wrapper */}
          <div className="h-[calc(100vh-4rem)] overflow-auto">
            <div className="p-4 md:p-6">
              {children || <Outlet />}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
