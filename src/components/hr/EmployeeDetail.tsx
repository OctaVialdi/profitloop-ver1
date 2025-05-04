
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmployeeWithDetails } from "@/services/employeeService";
import {
  EmployeeDetailSidebar,
  PersonalSection,
  EmploymentSection,
  EducationSection,
  TimeManagementSection,
  PayrollSection,
  FinanceSection,
  FilesSection,
  AssetsSection,
  HistorySection,
  DefaultSection
} from "./employee-detail";

interface EmployeeDetailProps {
  employee: EmployeeWithDetails;
  activeTab: string;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ 
  employee,
  activeTab: initialActiveTab = "personal"
}) => {
  const navigate = useNavigate();
  const [activeTab] = useState(initialActiveTab);

  // Handle edit button click
  const handleEdit = (section: string) => {
    const route = `/my-info/${section}?id=${employee.id}`;
    navigate(route);
    
    if (section !== "personal" && section !== "employment" && section !== "education") {
      toast.success(`Editing ${section} information`, {
        description: "This feature is coming soon."
      });
    }
  };

  // Convert to legacy employee object format for backward compatibility
  const convertToLegacyFormat = () => {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      mobilePhone: employee.personalDetails?.mobile_phone || "",
      birthPlace: employee.personalDetails?.birth_place || "",
      birthDate: employee.personalDetails?.birth_date || "",
      gender: employee.personalDetails?.gender || "",
      maritalStatus: employee.personalDetails?.marital_status || "",
      religion: employee.personalDetails?.religion || "",
      address: employee.identityAddress?.residential_address || "",
      jobPosition: employee.employment?.job_position || "",
      jobLevel: employee.employment?.job_level || "",
      organization: employee.employment?.organization || "",
      employeeId: employee.employee_id || "",
      barcode: employee.employment?.barcode || "",
      employmentStatus: employee.employment?.employment_status || "",
      branch: employee.employment?.branch || "",
      joinDate: employee.employment?.join_date || "",
      signDate: employee.employment?.sign_date || "",
      status: employee.status,
      role: employee.role
    };
  };

  // Render content for each section
  const renderSectionContent = () => {
    // Use legacy format for backward compatibility
    const legacyFormat = convertToLegacyFormat();
    
    switch (activeTab) {
      case 'personal':
        return <PersonalSection employee={legacyFormat} handleEdit={handleEdit} />;
        
      case 'employment':
        return <EmploymentSection employee={legacyFormat} handleEdit={handleEdit} />;
        
      case 'education':
        return <EducationSection employee={legacyFormat} handleEdit={handleEdit} />;

      // Attendance section in Time Management
      case 'attendance':
      case 'schedule':
      case 'time-off':
        return (
          <TimeManagementSection 
            employee={legacyFormat} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Payroll section  
      case 'payroll-info':
        return <PayrollSection employee={legacyFormat} handleEdit={handleEdit} />;

      // Finance sections
      case 'reimbursement':
      case 'cash-advance':
      case 'loan':
        return (
          <FinanceSection 
            employee={legacyFormat} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Files section
      case 'files':
        return <FilesSection employee={legacyFormat} handleEdit={handleEdit} />;

      // Assets section
      case 'assets':
        return <AssetsSection employee={legacyFormat} handleEdit={handleEdit} />;

      // History sections
      case 'adjustment':
      case 'transfer':
      case 'npp':
      case 'reprimand':
        return (
          <HistorySection 
            employee={legacyFormat} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Default case for any other sections
      default:
        return <DefaultSection activeTab={activeTab} handleEdit={handleEdit} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left sidebar with profile picture and navigation */}
      <EmployeeDetailSidebar 
        employee={convertToLegacyFormat()} 
        activeTab={activeTab} 
        handleEdit={handleEdit} 
      />

      {/* Main content area */}
      <div className="flex-1">
        {renderSectionContent()}
      </div>
    </div>
  );
}
