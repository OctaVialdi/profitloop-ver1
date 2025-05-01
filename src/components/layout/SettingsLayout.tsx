
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";

interface Tab {
  name: string;
  href: string;
  requiredRole?: "admin" | "super_admin";
}

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();
  const { isAdmin, isSuperAdmin } = useOrganization();
  
  const tabs: Tab[] = [
    { name: "Dashboard", href: "/settings/dashboard" },
    { name: "Invite Members", href: "/settings/invite", requiredRole: "admin" },
    { name: "Team Members", href: "/settings/members" },
    { name: "Collaborations", href: "/settings/collaborations", requiredRole: "admin" },
    { name: "Subscription", href: "/settings/subscription", requiredRole: "admin" },
    { name: "Organization", href: "/settings/organization", requiredRole: "admin" },
    { name: "Profile", href: "/settings/profile" },
  ];
  
  const filteredTabs = tabs.filter(tab => {
    if (!tab.requiredRole) return true;
    if (tab.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (tab.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  const currentPath = location.pathname;
  
  // Find the active tab based on the current path
  const activeTab = filteredTabs.find(tab => 
    currentPath === tab.href || 
    currentPath.startsWith(`${tab.href}/`)
  );
  
  // If no active tab is found, default to the first tab
  const defaultTab = activeTab?.href || filteredTabs[0]?.href || "/settings/profile";

  return (
    <div className="w-full space-y-4">
      <Card className="sticky top-0 z-10 mb-4 p-1 overflow-x-auto bg-white">
        <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full">
          <TabsList className="w-full justify-start">
            {filteredTabs.map((tab) => (
              <TabsTrigger 
                key={tab.href} 
                value={tab.href} 
                className="min-w-[100px]" 
                asChild
              >
                <Link to={tab.href}>{tab.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      
      <div className="pb-4">
        {children}
      </div>
    </div>
  );
}
