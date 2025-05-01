
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building, Check, ChevronDown, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvailableOrganizations } from "@/hooks/useAvailableOrganizations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function OrganizationSwitcher() {
  const { organizations, isLoading, switchOrganization } = useAvailableOrganizations();
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();

  const currentOrg = organizations.find(org => org.is_current);
  
  const handleSwitchOrg = async (orgId: string) => {
    if (isSwitching) return;
    
    setIsSwitching(true);
    const success = await switchOrganization(orgId);
    setIsSwitching(false);
    
    if (success) {
      // Refresh the page to load new organization context
      navigate('/dashboard');
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Memuat...</span>
      </Button>
    );
  }

  // Don't show the switcher if there's only one organization
  if (organizations.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {currentOrg?.logo_path ? (
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={currentOrg.logo_path}
                alt={currentOrg.name}
              />
              <AvatarFallback>
                <Building className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Building className="h-4 w-4" />
          )}
          <span className="max-w-[150px] truncate">
            {currentOrg?.name || "Organisasi"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Beralih Organisasi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            disabled={org.is_current || isSwitching}
            className={`flex items-center gap-2 ${
              org.is_current ? "bg-accent text-accent-foreground" : ""
            }`}
            onClick={() => !org.is_current && handleSwitchOrg(org.id)}
          >
            {org.logo_path ? (
              <Avatar className="h-5 w-5">
                <AvatarImage src={org.logo_path} alt={org.name} />
                <AvatarFallback>
                  <Building className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Building className="h-4 w-4" />
            )}
            <span className="flex-1 truncate">{org.name}</span>
            {org.is_current && <Check className="h-4 w-4" />}
            {isSwitching && org.id === currentOrg?.id && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
