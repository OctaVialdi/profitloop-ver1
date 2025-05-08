
import React from "react";
import { Settings, LayoutDashboard, MessageSquare, DollarSign, Activity, 
  Headset, Laptop, Users, Building, BookOpen, FileText, Clock, 
  CircleDollarSign, UserPlus, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  SidebarSeparator,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: "admin" | "super_admin";
  submenu?: NavigationSubItem[];
  active?: boolean;
}

interface NavigationSubItem {
  name: string;
  href: string;
  active?: boolean;
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
  const location = useLocation();
  // Get sidebar state to check if it's expanded or collapsed
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // HR Submenu items
  const hrSubmenu: NavigationSubItem[] = [
    { 
      name: "Dashboard", 
      href: "/hr/dashboard",
      active: currentPath === "/hr/dashboard"
    },
    { 
      name: "Employees", 
      href: "/hr/data",
      active: currentPath === "/hr/data"
    },
    { 
      name: "Attendance", 
      href: "/hr/absensi",
      active: currentPath === "/hr/absensi"
    },
    { 
      name: "Time Off", 
      href: "/hr/cuti",
      active: currentPath === "/hr/cuti"
    },
    { 
      name: "Contracts", 
      href: "/hr/kontrak",
      active: currentPath === "/hr/kontrak"
    },
    { 
      name: "Training", 
      href: "/hr/training",
      active: currentPath === "/hr/training"
    },
    { 
      name: "Performance", 
      href: "/hr/kinerja",
      active: currentPath === "/hr/kinerja"
    },
    { 
      name: "Company", 
      href: "/hr/company",
      active: currentPath === "/hr/company"
    }
  ];

  // Navigation items organized by category
  const mainNavigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: currentPath === "/dashboard"
    },
    {
      name: "Human Resources",
      href: "/hr/dashboard",
      icon: Users,
      active: currentPath.startsWith("/hr"),
      submenu: hrSubmenu
    },
    {
      name: "Finance",
      href: "/finance/dashboard",
      icon: DollarSign,
      active: currentPath.startsWith("/finance")
    },
    {
      name: "Operational",
      href: "/operations/dashboard",
      icon: Activity,
      active: currentPath.startsWith("/operations")
    }
  ];

  const communicationNavigationItems: NavigationItem[] = [
    {
      name: "Meeting Notes",
      href: "/catatan-meetings",
      icon: MessageSquare,
      active: currentPath.startsWith("/catatan-meetings")
    }
  ];

  const techNavigationItems: NavigationItem[] = [
    {
      name: "Digital Marketing",
      href: "/marketing/ads-performance",
      icon: Laptop,
      active: currentPath.startsWith("/marketing")
    },
    {
      name: "IT Support",
      href: "/it/dashboard",
      icon: Headset,
      active: currentPath.startsWith("/it")
    },
    {
      name: "Settings",
      href: "/settings/dashboard",
      icon: Settings,
      requiredRole: "admin",
      active: currentPath.startsWith("/settings")
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
      className="sticky top-0 h-screen z-20 border-r bg-gradient-to-b from-white to-gray-50 dark:from-sidebar dark:to-sidebar dark:bg-sidebar shadow-sm"
    >
      <SidebarRail />
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* Header with logo */}
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Avatar className={cn(
              "h-10 w-10 bg-blue-100 border border-blue-200",
              isCollapsed ? "mx-auto" : ""
            )}>
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt={organization?.name || "Organization"} />
              ) : (
                <AvatarFallback className="bg-blue-600 text-white font-medium">
                  {getInitials(organization?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-blue-600 truncate max-w-[150px]">
                  {organization?.name || "Organization"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Management System
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Main navigation section */}
        <div className="flex-1 py-2 overflow-y-auto scrollbar-thin">
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : ""}>
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavItems(mainNavigationItems).map((item) => (
                  <SidebarMenuItem key={item.name}>
                    {item.submenu ? (
                      <Collapsible>
                        <CollapsibleTrigger className="w-full">
                          <SidebarMenuButton 
                            tooltip={item.name}
                            isActive={item.active}
                            className="w-full justify-between group"
                          >
                            <div className="flex items-center">
                              <item.icon className="h-5 w-5 shrink-0" />
                              <span className={isCollapsed ? "sr-only" : "ml-2"}>{item.name}</span>
                            </div>
                            {!isCollapsed && (
                              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {!isCollapsed && (
                            <SidebarMenuSub>
                              {item.submenu.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.name}>
                                  <SidebarMenuSubButton 
                                    asChild 
                                    isActive={subItem.active}
                                  >
                                    <Link to={subItem.href}>
                                      {subItem.name}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton 
                        tooltip={item.name} 
                        isActive={item.active} 
                        asChild
                      >
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className={isCollapsed ? "sr-only" : "ml-2"}>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2" />

          {/* Communication section */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : ""}>
              Communication
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavItems(communicationNavigationItems).map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      tooltip={item.name} 
                      isActive={item.active} 
                      asChild
                    >
                      <Link to={item.href} className="flex items-center">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={isCollapsed ? "sr-only" : "ml-2"}>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2" />

          {/* Tech & Settings section */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : ""}>
              Technology & Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavItems(techNavigationItems).map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      tooltip={item.name} 
                      isActive={item.active} 
                      asChild
                    >
                      <Link to={item.href} className="flex items-center">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={isCollapsed ? "sr-only" : "ml-2"}>{item.name}</span>
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
            <SidebarTrigger className="ml-auto text-blue-600 hover:text-blue-800 transition-colors" />
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
