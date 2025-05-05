import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { employeeService, Employee } from "@/services/employeeService";
import { convertToLegacyFormat, LegacyEmployee } from "@/hooks/useEmployees";
import {
  EmployeeDetailSidebar,
  PersonalSection,
  EmploymentSection,
  IdentityAddressSection,
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
  employee: Employee;
  activeTab: string;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ 
  employee,
  activeTab: initialActiveTab = "personal"
}) => {
  const navigate = useNavigate();
  const [activeTab] = useState(initialActiveTab);
  const [employeeData, setEmployeeData] = useState<Employee>(employee);

  // Convert to legacy employee object format for backward compatibility
  const legacyEmployee: LegacyEmployee = convertToLegacyFormat(employeeData);

  // Handle edit button click
  const handleEdit = async (section: string) => {
    if (section === "refresh") {
      try {
        const refreshedEmployee = await employeeService.fetchEmployeeById(employee.id);
        if (refreshedEmployee) {
          setEmployeeData(refreshedEmployee);
          toast.success("Data refreshed successfully");
        }
      } catch (error) {
        console.error("Error refreshing employee data:", error);
        toast.error("Failed to refresh data");
      }
      return;
    }
    
    const route = `/my-info/${section}?id=${employee.id}`;
    navigate(route);
    
    if (section !== "personal" && section !== "employment" && section !== "education") {
      toast.success(`Editing ${section} information`, {
        description: "This feature is coming soon."
      });
    }
  };

  // Render content for each section
  const renderSectionContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <>
            <PersonalSection employee={legacyEmployee} handleEdit={handleEdit} />
            <IdentityAddressSection employee={legacyEmployee} handleEdit={handleEdit} />
          </>
        );
        
      case 'employment':
        return <EmploymentSection employee={legacyEmployee} handleEdit={handleEdit} />;
        
      case 'education':
        return <EducationSection employee={legacyEmployee} handleEdit={handleEdit} />;

      // Attendance section in Time Management
      case 'attendance':
      case 'schedule':
      case 'time-off':
        return (
          <TimeManagementSection 
            employee={legacyEmployee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Payroll section  
      case 'payroll-info':
        return <PayrollSection employee={legacyEmployee} handleEdit={handleEdit} />;

      // Finance sections
      case 'reimbursement':
      case 'cash-advance':
      case 'loan':
        return (
          <FinanceSection 
            employee={legacyEmployee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Files section
      case 'files':
        return <FilesSection employee={legacyEmployee} handleEdit={handleEdit} />;

      // Assets section
      case 'assets':
        return <AssetsSection employee={legacyEmployee} handleEdit={handleEdit} />;

      // History sections
      case 'adjustment':
      case 'transfer':
      case 'npp':
      case 'reprimand':
        return (
          <HistorySection 
            employee={legacyEmployee} 
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
        employee={legacyEmployee} 
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
