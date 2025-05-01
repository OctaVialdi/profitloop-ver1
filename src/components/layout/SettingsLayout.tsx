
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
    // Removed dashboard tab that doesn't exist
    { name: "Invite Members", href: "/settings/invite", requiredRole: "admin" },
    { name: "Team Members", href: "/settings/members" },
    { name: "Collaborations", href: "/settings/collaborations", requiredRole: "admin" },
    { name: "Subscription", href: "/settings/subscription", requiredRole: "admin" },
    { name: "Organization", href: "/settings/organization", requiredRole: "admin" },
    { name: "Profile", href: "/settings/profile" }, // This is the path we'll use
  ];
  
  const filteredTabs = tabs.filter(tab => {
    if (!tab.requiredRole) return true;
    if (tab.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (tab.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  const currentTab = filteredTabs.find(tab => 
    location.pathname === tab.href || 
    location.pathname.startsWith(`${tab.href}/`)
  );

  return (
    <div className="w-full space-y-4">
      <Card className="mb-4 p-1 overflow-x-auto">
        <Tabs defaultValue={currentTab?.href || filteredTabs[0].href} className="w-full">
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
      
      <div>
        {children}
      </div>
    </div>
  );
}
