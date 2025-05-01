
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BuildingIcon,
  CreditCard,
  FileIcon,
  Home,
  LayoutDashboardIcon,
  MessageSquare,
  SlidersHorizontal,
  Star,
  Users,
  Settings,
  BellIcon,
  UserPlus,
  UserCircle,
  Link2Icon,
  FileCog,
  Wand2,
} from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { 
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "./sidebar";

interface SidebarConfig {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

export function RoleBasedMenu() {
  const { userProfile, isAdmin, isSuperAdmin } = useOrganization();
  const role = userProfile?.role;
  
  const sidebarConfig: SidebarConfig[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Notifications", href: "/notifications", icon: BellIcon },
    
    // Add a divider
    { title: "divider-1", href: "", icon: Users },
    
    // Management section
    { title: "Team Management", href: "", icon: Users, roles: ["admin", "super_admin"] },
    { title: "Invite Members", href: "/invite", icon: UserPlus, roles: ["admin", "super_admin"] },
    { title: "Magic Link Invite", href: "/magic-invite", icon: Wand2, roles: ["admin", "super_admin"] },
    { title: "Manage Members", href: "/members", icon: UserCircle, roles: ["admin", "super_admin"] },
    { title: "Organizations", href: "/collaborations", icon: Link2Icon, roles: ["admin", "super_admin"] },
    
    // Add a divider
    { title: "divider-2", href: "", icon: Settings },
    
    // Settings section
    { title: "Settings", href: "", icon: Settings },
    { title: "Organization", href: "/organization-settings", icon: BuildingIcon, roles: ["admin", "super_admin"] },
    { title: "Subscription", href: "/subscription", icon: CreditCard, roles: ["admin", "super_admin"] },
    { title: "Profile", href: "/settings/profile", icon: SlidersHorizontal },
  ];

  // Filter menu items based on user role
  const filteredItems = sidebarConfig.filter((item) => {
    // Always show dividers
    if (item.title.startsWith("divider-")) return true;
    
    // If no roles are specified, show for everyone
    if (!item.roles) return true;
    
    // Check if user has required role
    if (isSuperAdmin) return true;
    if (isAdmin && !item.roles.includes("super_admin")) return true;
    if (role && item.roles.includes(role)) return true;
    
    // Hide if user doesn't have required role
    return false;
  });

  // Using the correct sidebar components structure
  return (
    <div className="w-full">
      <SidebarMenu>
        {filteredItems.map((item) => (
          item.title.startsWith("divider-") ? (
            <div
              key={item.title}
              className="h-px bg-muted my-2 mx-2 dark:bg-muted"
            />
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild={item.href ? true : false}>
                {item.href ? (
                  <a href={item.href} className="w-full flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <span className="w-full flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        ))}
      </SidebarMenu>
    </div>
  );
}
