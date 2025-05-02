
import { Settings, LayoutDashboard, MessageSquare, DollarSign, Activity, Headset, CircleDollarSign, Truck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: "admin" | "super_admin";
}
interface DashboardSidebarProps {
  organization: any;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  logoUrl?: string;
  currentPath: string;
}
export function DashboardSidebar({
  organization,
  isAdmin,
  isSuperAdmin,
  logoUrl,
  currentPath
}: DashboardSidebarProps) {
  // Get sidebar state to check if it's expanded or collapsed
  const {
    state
  } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Navigation items - added Digital Marketing menu item between Operational and Settings
  const navigationItems: NavigationItem[] = [{
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  }, {
    name: "Catatan Meetings",
    href: "/catatan-meetings",
    icon: MessageSquare
  }, {
    name: "Finance",
    href: "/finance/dashboard",
    icon: DollarSign
  }, {
    name: "Operational",
    href: "/operations/dashboard",
    icon: Activity
  }, {
    name: "Digital Marketing",
    href: "/marketing/ads-performance",
    icon: TrendingUp
  }, {
    name: "Settings",
    href: "/settings/dashboard",
    icon: Settings,
    requiredRole: "admin"
  }];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (item.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });
  return <Sidebar variant="sidebar" collapsible="icon" className="sticky top-0 h-screen z-20 border-r bg-white dark:bg-sidebar">
      <SidebarRail />
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* Menu group - explicitly positioned at the top */}
        <div className="mt-4">
          <SidebarGroup className="order-first">
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "font-medium text-blue-600"}>
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavItems.map(item => <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton tooltip={item.name} isActive={currentPath.startsWith(item.href)} asChild>
                      <Link to={item.href} className="flex items-center">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={isCollapsed ? "sr-only" : "ml-2"}>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        {/* Organization name section - explicitly positioned at the bottom */}
        <div className="flex items-center p-4 justify-between">
          {!isCollapsed && <div className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {organization?.name || "Organisasi"}
            </div>}
          <SidebarTrigger className="ml-auto text-blue-600" />
        </div>
      </SidebarContent>
    </Sidebar>;
}
