
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2 } from "lucide-react";
import { robustSignOut } from "@/utils/authUtils";

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const { userProfile } = useOrganization();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [initials, setInitials] = useState("...");
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.full_name) {
      const nameParts = userProfile.full_name.split(' ');
      if (nameParts.length > 0) {
        let initials = nameParts[0][0] || '';
        if (nameParts.length > 1) {
          initials += nameParts[nameParts.length - 1][0] || '';
        }
        setInitials(initials.toUpperCase());
      }
    } else if (user?.email) {
      setInitials(user.email.substring(0, 2).toUpperCase());
    }
  }, [user, userProfile]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Use robustSignOut to clean up auth state
      await robustSignOut();
      
      // Also call the signOut method from useAuth
      await signOut();
      
      // Navigate to login page
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.profile_image || ""} alt="Profile" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile?.full_name || user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email || user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings/organization')}>
            Organization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings/subscription')}>
            Subscription
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isSigningOut} onClick={handleSignOut}>
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            "Log out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
