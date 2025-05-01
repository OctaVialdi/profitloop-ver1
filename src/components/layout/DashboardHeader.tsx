
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, CreditCard, Bell, Users, Building, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationSystem } from "@/components/NotificationSystem";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { userProfile, isSuperAdmin, isAdmin, organization } = useOrganization();
  const navigate = useNavigate();
  
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
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile SidebarTrigger is handled by the sidebar component */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-blue-600 hidden sm:block">
              {organization?.name || "Klinik Utama Pandawa"}
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <OrganizationSwitcher />
          
          <NotificationSystem />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 hidden md:inline-block max-w-[150px] truncate">
                  {userProfile?.full_name || userProfile?.email || "User"}
                </span>
                {(isSuperAdmin || isAdmin) && (
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full hidden md:inline-block" style={{
                    backgroundColor: isSuperAdmin ? "#f3e8ff" : "#dbeafe",
                    color: isSuperAdmin ? "#7e22ce" : "#2563eb"
                  }}>
                    {isSuperAdmin ? "Super Admin" : "Admin"}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{userProfile?.full_name || "User"}</span>
                  <span className="text-xs text-gray-500 truncate">{userProfile?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profil Saya</span>
                </Link>
              </DropdownMenuItem>
              {(isAdmin || isSuperAdmin) && (
                <DropdownMenuItem asChild>
                  <Link to="/settings/organisation" className="flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4" />
                    <span>Pengaturan Organisasi</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/members" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <span>Kelola Anggota</span>
                </Link>
              </DropdownMenuItem>
              {(isAdmin || isSuperAdmin) && (
                <DropdownMenuItem asChild>
                  <Link to="/settings/subscription" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    <span>Langganan</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/settings/notifications" className="flex items-center gap-2 cursor-pointer">
                  <Bell className="h-4 w-4" />
                  <span>Notifikasi</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
