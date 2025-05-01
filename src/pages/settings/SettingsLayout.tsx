
import { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Building, CreditCard, Bell, Activity, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/hooks/useOrganization";

interface SettingsTabProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  requiredRole?: "admin" | "super_admin";
}

function SettingsTab({ href, icon: Icon, label, isActive, requiredRole }: SettingsTabProps) {
  const { isAdmin, isSuperAdmin } = useOrganization();
  
  // Check permissions
  if (requiredRole === "admin" && !(isAdmin || isSuperAdmin)) return null;
  if (requiredRole === "super_admin" && !isSuperAdmin) return null;
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export default function SettingsLayout() {
  const location = useLocation();
  const { isSuperAdmin, isAdmin } = useOrganization();
  
  const settingsTabs = [
    { 
      href: "/settings/organisation",
      icon: Building,
      label: "Organisasi",
      requiredRole: "admin" as const
    },
    { 
      href: "/settings/subscription",
      icon: CreditCard,
      label: "Langganan",
      requiredRole: "admin" as const
    },
    { 
      href: "/settings/notifications",
      icon: Bell,
      label: "Notifikasi" 
    },
    // Add more tabs here as needed
    { 
      href: "/settings/activity",
      icon: Activity,
      label: "Audit Log",
      requiredRole: "admin" as const
    },
  ];
  
  // Filter tabs based on user role
  const filteredTabs = settingsTabs.filter(tab => {
    if (!tab.requiredRole) return true;
    if (tab.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (tab.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-gray-600">Kelola pengaturan organisasi dan preferensi personal</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border p-2 space-y-1 sticky top-[5rem]">
            {filteredTabs.map((tab) => (
              <SettingsTab
                key={tab.href}
                href={tab.href}
                icon={tab.icon}
                label={tab.label}
                isActive={location.pathname === tab.href}
                requiredRole={tab.requiredRole}
              />
            ))}
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-lg border p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
