
import { Building, Home, Users, UserPlus, CreditCard, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail
} from "@/components/ui/sidebar";

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
  
  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Undang Anggota", href: "/invite", icon: UserPlus, requiredRole: "admin" },
    { name: "Anggota Tim", href: "/members", icon: Users },
    { name: "Kolaborasi", href: "/collaborations", icon: Building, requiredRole: "admin" },
    { name: "Subscription", href: "/subscription", icon: CreditCard, requiredRole: "admin" },
    { name: "Pengaturan", href: "/organization/settings", icon: Settings, requiredRole: "admin" },
    { name: "Notifikasi", href: "/notifications", icon: Bell },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (item.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  return (
    <>
      <Sidebar>
        <SidebarRail />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {organization?.name || "Organisasi"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      tooltip={item.name}
                      isActive={currentPath === item.href}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
