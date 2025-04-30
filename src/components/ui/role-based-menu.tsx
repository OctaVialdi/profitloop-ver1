
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface RoleBasedMenuProps {
  links: {
    href: string;
    label: string;
    icon: LucideIcon;
    requiredRole?: 'employee' | 'admin' | 'super_admin';
  }[];
  userRole: 'super_admin' | 'admin' | 'employee' | null;
}

export function RoleBasedMenu({ links, userRole }: RoleBasedMenuProps) {
  // Helper function to determine if a user can access a link based on their role
  const canAccess = (requiredRole?: 'employee' | 'admin' | 'super_admin') => {
    if (!requiredRole) return true; // No role requirement, everyone can access
    if (!userRole) return false; // No user role, can't access anything with role requirements
    
    switch(requiredRole) {
      case 'employee':
        return true; // All roles can access employee-level links
      case 'admin':
        return userRole === 'admin' || userRole === 'super_admin';
      case 'super_admin':
        return userRole === 'super_admin';
      default:
        return false;
    }
  };

  return (
    <nav className="grid items-start px-2 gap-2">
      {links
        .filter(link => canAccess(link.requiredRole))
        .map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
      })}
    </nav>
  );
}
