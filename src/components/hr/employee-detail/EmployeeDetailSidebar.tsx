
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/ui/file-upload";
import { updateEmployeeProfileImage } from "@/services/employeeService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface EmployeeDetailSidebarProps {
  employee: LegacyEmployee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const EmployeeDetailSidebar: React.FC<EmployeeDetailSidebarProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const location = useLocation();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const navigation = [
    { name: "Personal", href: `/my-info/personal?id=${employee.id}`, tab: "personal" },
    { name: "Employment", href: `/my-info/employment?id=${employee.id}`, tab: "employment" },
    { name: "Education", href: `/my-info/education?id=${employee.id}`, tab: "education" },
    { name: "Files", href: `/my-info/files?id=${employee.id}`, tab: "files" },
    { name: "Assets", href: `/my-info/assets?id=${employee.id}`, tab: "assets" },
  ];

  const attendanceItems = [
    { name: "Attendance", href: `/my-info/attendance?id=${employee.id}`, tab: "attendance" },
    { name: "Schedule", href: `/my-info/schedule?id=${employee.id}`, tab: "schedule" },
    { name: "Time off", href: `/my-info/time-off?id=${employee.id}`, tab: "time-off" },
  ];

  const financeItems = [
    { name: "Payroll info", href: `/my-info/payroll-info?id=${employee.id}`, tab: "payroll-info" },
    { name: "Reimbursement", href: `/my-info/reimbursement?id=${employee.id}`, tab: "reimbursement" },
    { name: "Cash advance", href: `/my-info/cash-advance?id=${employee.id}`, tab: "cash-advance" },
    { name: "Loan", href: `/my-info/loan?id=${employee.id}`, tab: "loan" },
  ];

  const employeeHistoryItems = [
    { name: "Adjustment", href: `/my-info/adjustment?id=${employee.id}`, tab: "adjustment" },
    { name: "Transfer", href: `/my-info/transfer?id=${employee.id}`, tab: "transfer" },
    { name: "NPP", href: `/my-info/npp?id=${employee.id}`, tab: "npp" },
    { name: "Reprimand", href: `/my-info/reprimand?id=${employee.id}`, tab: "reprimand" },
  ];
  
  // Get initials for avatar fallback
  const getInitials = () => {
    return employee.name ? employee.name.charAt(0).toUpperCase() : "?";
  };

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      setUploadingPhoto(true);
      
      const url = await updateEmployeeProfileImage(employee.id, file);
      
      if (url) {
        toast.success("Profile photo updated successfully");
        // Refresh data to show the new photo
        handleEdit("refresh");
      } else {
        throw new Error("Failed to update profile photo");
      }
    } catch (error) {
      console.error("Failed to update profile photo:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      {/* Profile summary with avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          {uploadingPhoto ? (
            <div className="h-32 w-32 rounded-full flex items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Avatar className="h-32 w-32 border">
              <AvatarImage src={employee.profile_image || undefined} alt={employee.name} />
              <AvatarFallback className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center text-xl font-medium relative">
                {getInitials()}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                  <FileUpload
                    onUpload={handleProfilePhotoUpload}
                    accept="image/png,image/jpeg,image/jpg"
                    buttonText="Change Photo"
                    maxSizeMB={2}
                    variant="ghost"
                    className="text-white"
                  />
                </div>
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-medium">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.position || "No position"}</p>
        </div>
        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
          ID: {employee.employee_id || "N/A"}
        </div>
      </div>

      {/* Navigation items */}
      <div className="mt-4 space-y-1">
        {/* Main navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium",
                activeTab === item.tab
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Attendance section */}
        <div>
          <Separator className="my-2" />
          <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Attendance
          </h4>
          <nav className="mt-1 space-y-1">
            {attendanceItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  activeTab === item.tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Finance section */}
        <div>
          <Separator className="my-2" />
          <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Finance
          </h4>
          <nav className="mt-1 space-y-1">
            {financeItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  activeTab === item.tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* History section */}
        <div>
          <Separator className="my-2" />
          <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Employee history
          </h4>
          <nav className="mt-1 space-y-1">
            {employeeHistoryItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  activeTab === item.tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};
