
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Home, LogOut, Menu, Users, UserPlus, CreditCard, Bell, Settings } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAppTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { organization, userProfile, isLoading, isAdmin, isSuperAdmin } = useOrganization();
  const { logoUrl } = useAppTheme();

  const navigationItems = [
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-6">
                      {logoUrl ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={logoUrl} alt={organization?.name || "Logo"} />
                          <AvatarFallback>
                            <Building className="h-4 w-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Building className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-semibold">{organization?.name || "Organisasi"}</span>
                    </div>
                    <nav className="space-y-1">
                      {filteredNavItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                            currentPath === item.href ? "bg-gray-100 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              {logoUrl ? (
                <Avatar className="h-8 w-8 hidden md:flex">
                  <AvatarImage src={logoUrl} alt={organization?.name || "Logo"} />
                  <AvatarFallback>
                    <Building className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <span className="text-xl font-semibold text-blue-600">
                {organization?.name || "Multi-Tenant"}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
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
      
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 bg-white border-r p-4 shrink-0">
          <div className="flex items-center gap-2 mb-6">
            {logoUrl ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={logoUrl} alt={organization?.name || "Logo"} />
                <AvatarFallback>
                  <Building className="h-5 w-5 text-blue-600" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Building className="h-5 w-5 text-blue-600" />
            )}
            <span className="font-semibold">{organization?.name || "Organisasi"}</span>
          </div>
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                  currentPath === item.href ? "bg-gray-100 text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
