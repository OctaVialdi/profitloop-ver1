
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building,
  ChevronLeft,
  Home,
  Users,
  UserPlus,
  CreditCard,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useAppTheme } from "@/components/ThemeProvider";
import { Separator } from "@/components/ui/separator";

interface SidebarContainerProps {
  children: ReactNode;
}

export function SidebarContainer({ children }: SidebarContainerProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { organization, isAdmin, isSuperAdmin, userProfile } = useOrganization();
  const { logoUrl } = useAppTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  // Define base navigation items
  const dashboardItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
  ];

  const managementItems = [
    { name: "Anggota Tim", href: "/members", icon: Users },
  ];
  
  // Admin only navigation items
  const adminItems = [
    { name: "Undang Anggota", href: "/invite", icon: UserPlus, requiredRole: "admin" },
    { name: "Kolaborasi", href: "/collaborations", icon: Building, requiredRole: "admin" },
  ];

  const settingsItems = [
    { name: "Pengaturan Organisasi", href: "/settings/organisation", icon: Building, requiredRole: "admin", originalPath: "/organization/settings" },
    { name: "Subscription", href: "/settings/subscription", icon: CreditCard, requiredRole: "admin", originalPath: "/subscription" },
    { name: "Notifikasi", href: "/settings/notifications", icon: Bell, originalPath: "/notifications" },
  ];
  
  // Filter items based on user role
  const filteredAdminItems = adminItems.filter(item => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (item.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  const filteredSettingsItems = settingsItems.filter(item => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (item.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  // Handle redirect for reorganized routes
  useEffect(() => {
    const originalRoutes = settingsItems.map(item => ({
      original: item.originalPath,
      new: item.href
    })).filter(route => route.original && route.original !== route.new);
    
    const matchedRoute = originalRoutes.find(route => currentPath === route.original);
    if (matchedRoute) {
      window.history.replaceState(null, '', matchedRoute.new);
    }
  }, [currentPath]);

  // Check if a path is active (including settings sub-routes)
  const isPathActive = (path: string) => {
    if (path.startsWith('/settings') && currentPath.startsWith('/settings')) {
      return path === currentPath;
    }
    return path === currentPath || (path === '/dashboard' && currentPath === '/');
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <Avatar className={cn("transition-all", state === "expanded" ? "h-10 w-10" : "h-7 w-7")}>
              <AvatarImage src={logoUrl} alt={organization?.name || "Logo"} />
              <AvatarFallback>
                <Building className={cn("text-blue-600", state === "expanded" ? "h-5 w-5" : "h-4 w-4")} />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Building className="h-5 w-5 text-blue-600" />
          )}
          {state === "expanded" && (
            <span className="font-semibold truncate max-w-[160px]">{organization?.name || "Organisasi"}</span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-transparent">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", 
            state !== "expanded" && "transform rotate-180")} />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {dashboardItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={isPathActive(item.href)}
                tooltip={state !== "expanded" ? item.name : undefined}
              >
                <Link to={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {managementItems.length > 0 && (
          <>
            <Separator className="my-2" />
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isPathActive(item.href)}
                    tooltip={state !== "expanded" ? item.name : undefined}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}

        {filteredAdminItems.length > 0 && (
          <>
            <Separator className="my-2" />
            <SidebarMenu>
              {filteredAdminItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isPathActive(item.href)}
                    tooltip={state !== "expanded" ? item.name : undefined}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}

        {filteredSettingsItems.length > 0 && (
          <>
            <Separator className="my-2" />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={currentPath.startsWith('/settings')}
                  tooltip={state !== "expanded" ? "Pengaturan" : undefined}
                >
                  <Link to="/settings/organisation">
                    <Settings />
                    <span>Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {state === "expanded" && userProfile && (
          <div className="text-xs text-center text-gray-500">
            <p>Versi App: 1.0.0</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
