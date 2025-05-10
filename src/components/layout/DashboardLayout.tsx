
import { ReactNode, memo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAppTheme } from "@/components/ThemeProvider";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { 
  SidebarProviderWithTooltip as SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { AnimatePresence, motion } from "framer-motion";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

// Import your sidebar navigation component
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

// Use memo to prevent unnecessary re-renders of the HeaderActions
const HeaderActions = memo(() => (
  <div className="flex items-center gap-3">
    <OrganizationSwitcher />
    <NotificationSystem />
    <ProfileDropdown />
  </div>
));

HeaderActions.displayName = "HeaderActions";

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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

  // Determine if we should show breadcrumbs based on the current path
  const shouldShowBreadcrumbs = location.pathname !== "/dashboard";
  const hideBreadcrumbsOnSpecificPages = location.pathname === "/hr/company";
  
  // Determine custom breadcrumb labels based on the path
  const customLabels: Record<string, string> = {};
  
  // Add support for dev section
  if (location.pathname.startsWith('/dev')) {
    customLabels["dev"] = "Developer";
    
    if (location.pathname.includes('/components')) {
      customLabels["components"] = "UI Components";
    }
  }
  
  // Add support for finance section
  if (location.pathname.startsWith('/finance')) {
    customLabels["finance"] = "Finance";
    
    if (location.pathname.includes('/dashboard')) {
      customLabels["dashboard"] = "Overview";
    }
  }
  
  // Add support for HR section
  if (location.pathname.startsWith('/hr')) {
    customLabels["hr"] = "Human Resources";
    
    if (location.pathname.includes('/dashboard')) {
      customLabels["dashboard"] = "Overview";
    }
    
    // Handle company section
    if (location.pathname.includes('/company')) {
      customLabels["company"] = "Company Profile";
    }

    // Handle training section
    if (location.pathname.includes('/training')) {
      customLabels["training"] = "Training & Development";
    }

    // Handle recruitment section
    if (location.pathname.includes('/recruitment')) {
      customLabels["recruitment"] = "Recruitment";
    }
  }
  
  // Support for meeting notes
  if (location.pathname.startsWith('/catatan-meetings')) {
    customLabels["catatan-meetings"] = "Meeting Notes";
  }

  return (
    <SidebarProvider defaultOpen={true} className="group/sidebar-wrapper flex min-h-screen w-full">
      <DashboardSidebar
        organization={organization}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        logoUrl={logoUrl}
        currentPath={location.pathname}
      />
      
      {/* Main content */}
      <SidebarInset className="flex flex-col">
        {/* Top navigation - Modified to be full width without scroll constraints */}
        <header className="bg-white border-b sticky top-0 z-10 w-full shadow-sm">
          <div className="px-4 h-16 flex items-center justify-between">
            {shouldShowBreadcrumbs && !hideBreadcrumbsOnSpecificPages && (
              <BreadcrumbNav 
                customLabels={customLabels}
              />
            )}
            <HeaderActions />
          </div>
        </header>
        
        {/* Page content with direct overflow handling */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeInOut"
                }}
                className="will-change-transform"
              >
                {children || <Outlet />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
