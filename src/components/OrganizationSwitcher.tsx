
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Building, CheckIcon, ChevronDown, Loader2, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvailableOrganizations } from "@/hooks/useAvailableOrganizations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

export function OrganizationSwitcher() {
  const { organizations, isLoading, switchOrganization } = useAvailableOrganizations();
  const [open, setOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const currentOrg = organizations.find(org => org.is_current);
  
  useEffect(() => {
    if (currentOrg) {
      setActiveOrgId(currentOrg.id);
    }
  }, [currentOrg]);

  const handleSwitchOrg = async (orgId: string) => {
    if (isSwitching || orgId === activeOrgId) return;
    
    setIsSwitching(true);
    setActiveOrgId(orgId);
    const success = await switchOrganization(orgId);
    
    if (!success) {
      setActiveOrgId(currentOrg?.id || null);
      setIsSwitching(false);
      return;
    }
    
    setOpen(false);
    
    // Give a visual feedback before reload
    setTimeout(() => {
      navigate('/dashboard');
      window.location.reload();
    }, 500);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100">
          {currentOrg?.logo_path ? (
            <Avatar className="h-6 w-6">
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
          <span className="max-w-[150px] truncate hidden md:inline-block">
            {currentOrg?.name || "Organisasi"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <Command>
          <CommandInput placeholder="Cari organisasi..." />
          <CommandList>
            <CommandEmpty>Tidak ada organisasi ditemukan.</CommandEmpty>
            <CommandGroup heading="Organisasi Anda">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  disabled={isSwitching}
                  onSelect={() => handleSwitchOrg(org.id)}
                  className="flex items-center gap-2 py-3 cursor-pointer"
                >
                  {org.logo_path ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={org.logo_path} alt={org.name} />
                      <AvatarFallback>
                        <Building className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Building className="h-4 w-4" />
                  )}
                  <span className="flex-1 truncate">{org.name}</span>
                  
                  {(isSwitching && org.id === activeOrgId) ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  ) : org.id === activeOrgId ? (
                    <CheckIcon className="h-4 w-4 text-primary ml-2" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  navigate('/onboarding');
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Organisasi Baru</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  navigate('/settings/organisation');
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Building className="h-4 w-4" />
                <span>Kelola Organisasi</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
