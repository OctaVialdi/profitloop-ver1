
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { userProfile, isSuperAdmin, isAdmin } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  
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

  // Get the user's role label
  const getRoleLabel = () => {
    if (isSuperAdmin) return "Super Admin";
    if (isAdmin) return "Admin";
    return "Employee";
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!userProfile?.full_name) return "U";
    return userProfile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md p-1.5 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="User profile"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="" 
              alt={userProfile?.full_name || "User"} 
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-medium truncate max-w-[150px]">
              {userProfile?.full_name || userProfile?.email || "User"}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[150px]">
              {getRoleLabel()}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[240px] p-2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
      >
        {/* User Info Section */}
        <div className="px-2 py-1.5 mb-2">
          <div className="font-medium truncate">
            {userProfile?.full_name || "User"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {userProfile?.email || ""}
          </div>
          <div className="text-xs text-blue-600 mt-1 font-medium">
            {getRoleLabel()}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2 py-2">
          <Link to="/settings/profile">
            <UserCircle className="h-4 w-4 mr-2" />
            Profil User
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2 py-2">
          <Link to="/settings/account">
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer flex items-center gap-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
