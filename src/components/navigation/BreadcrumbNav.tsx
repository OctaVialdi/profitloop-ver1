
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

// Map of route paths to readable names
const routeLabels: Record<string, string> = {
  "": "Home",
  "dashboard": "Dashboard",
  "hr": "Human Resources",
  "employees": "Employees",
  "company": "Company",
  "finance": "Finance",
  "settings": "Settings",
  "employee": "Employee",
  "profile": "Profile",
  "assets": "Assets",
  "files": "Files",
  "reprimand": "Reprimand",
  "history": "History",
  "org-structure": "Organization Structure",
  "dev": "Development",
  "components": "Components",
};

interface BreadcrumbNavProps {
  rootLabel?: string;
  excludePaths?: string[];
  customLabels?: Record<string, string>;
  showHomeIcon?: boolean;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  rootLabel = "Dashboard",
  excludePaths = [],
  customLabels = {},
  showHomeIcon = true,
  className = "mb-4",
}) => {
  const location = useLocation();
  
  // Merge default labels with custom labels
  const labels = { ...routeLabels, ...customLabels };
  
  // Split the pathname into segments and remove empty segments
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  // Filter out excluded paths
  const filteredSegments = pathSegments.filter(
    (segment) => !excludePaths.includes(segment)
  );
  
  // If there are no segments after filtering, return null
  if (filteredSegments.length === 0) {
    return null;
  }
  
  // Generate breadcrumb items
  const breadcrumbItems = filteredSegments.map((segment, index) => {
    // Build the path for this breadcrumb item
    const path = `/${filteredSegments.slice(0, index + 1).join("/")}`;
    
    // Get the label for this segment
    const label = labels[segment] || segment;
    
    // If this is the last segment, render it as the current page
    const isLastItem = index === filteredSegments.length - 1;
    
    return {
      path,
      label,
      isLastItem,
    };
  });

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">
                  <HomeIcon className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {item.isLastItem ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLastItem && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
