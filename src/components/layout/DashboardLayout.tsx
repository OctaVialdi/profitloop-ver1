
import { ReactNode, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAppTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail
} from "@/components/ui/sidebar";

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Berhasil logout");
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Gagal logout");
    }
  };

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
                <SidebarTrigger />
                
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
              
              <div className="flex items-center gap-2">
                <OrganizationSwitcher />
                <NotificationSystem />
                
                <span className="text-sm text-gray-500 hidden md:inline-block">
                  {userProfile?.full_name || userProfile?.email || "User"} 
                  {isSuperAdmin && <span className="ml-1 text-xs text-purple-600">(Super Admin)</span>}
                  {isAdmin && !isSuperAdmin && <span className="ml-1 text-xs text-blue-600">(Admin)</span>}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <div className="p-4 md:p-6">
            {children || <Outlet />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
