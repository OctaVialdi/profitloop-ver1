
import React from "react";
import { Settings, LayoutDashboard, MessageSquare, DollarSign, Activity, 
  Headset, Laptop, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarRail, 
  SidebarTrigger, 
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Navigation items in the specified order
  const navigationItems: NavigationItem[] = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard
    },
    {
      name: "Human Resources",
      href: "/hr/dashboard",
      icon: Users
    },
    {
      name: "Finance",
      href: "/finance/dashboard",
      icon: DollarSign
    },
    {
      name: "Operational",
      href: "/operations/dashboard",
      icon: Activity
    },
    {
      name: "Digital Marketing",
      href: "/marketing/ads-performance",
      icon: Laptop
    },
    {
      name: "IT Support",
      href: "/it/support",
      icon: Headset
    },
    {
      name: "Meeting Notes",
      href: "/catatan-meetings",
      icon: MessageSquare
    },
    {
      name: "Settings",
      href: "/settings/subscription",
      icon: Settings,
      requiredRole: "admin"
    }
  ];

  // Filter navigation items based on user role
  const filterNavItems = (items: NavigationItem[]) => {
    return items.filter(item => {
      if (!item.requiredRole) return true;
      if (item.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
      if (item.requiredRole === "super_admin" && isSuperAdmin) return true;
      return false;
    });
  };

  // Get the initials for the organization avatar
  const getInitials = (name?: string) => {
    if (!name) return "O";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="sticky top-0 h-screen z-20 border-r bg-white dark:bg-sidebar"
    >
      <SidebarRail />
      <SidebarContent className="flex flex-col justify-between h-full overflow-hidden">
        {/* Header with logo - only show when expanded */}
        {!isCollapsed && (
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 bg-blue-100 border border-blue-200">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={organization?.name || "Organization"} />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white font-medium">
                    {getInitials(organization?.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-blue-600 truncate max-w-[150px]">
                  {organization?.name || "Organization"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Management System
                </p>
              </div>
            </div>
          </SidebarHeader>
        )}

        {/* Main navigation section - no separators between groups */}
        <div className="flex-1 py-4">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 mb-2">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavItems(navigationItems).map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      tooltip={item.name} 
                      isActive={
                        item.href === "/" 
                          ? currentPath === "/" 
                          : currentPath.startsWith(item.href)
                      }
                      asChild
                      className={cn(
                        "flex items-center font-medium",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Link to={item.href} className="flex items-center">
                        <item.icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        {/* Footer section with collapse button */}
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">
                © 2025 Management System
              </span>
            )}
            <SidebarTrigger className={cn("text-blue-600 hover:text-blue-800 transition-colors", isCollapsed && "mx-auto")} />
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
