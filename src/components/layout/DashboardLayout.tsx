
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Home, LogOut, Menu, Settings, UserPlus, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // This would be fetched from Supabase after integration
  const user = {
    name: "John Doe",
    role: "super_admin"
  };

  const organization = {
    name: "PT Example Corp",
    subscription: "trial"
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Undang Anggota", href: "/invite", icon: UserPlus },
    { name: "Anggota Tim", href: "/members", icon: Users },
    { name: "Kolaborasi", href: "/collaborations", icon: Building },
    { name: "Subscription", href: "/subscription", icon: Settings },
  ];

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
                      <Building className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">{organization.name}</span>
                    </div>
                    <nav className="space-y-1">
                      {navigationItems.map((item) => (
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
            
            <Link to="/dashboard" className="text-xl font-semibold text-blue-600">
              Multi-Tenant
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden md:inline-block">
              {user.name} ({user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Karyawan"})
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
            <Building className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">{organization.name}</span>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
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
