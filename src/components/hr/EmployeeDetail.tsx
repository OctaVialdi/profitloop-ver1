
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Employee } from "@/hooks/useEmployees";
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
  employee: Employee;
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

  // Render content for each section
  const renderSectionContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalSection employee={employee} handleEdit={handleEdit} />;
        
      case 'employment':
        return <EmploymentSection employee={employee} handleEdit={handleEdit} />;
        
      case 'education':
        return <EducationSection employee={employee} handleEdit={handleEdit} />;

      // Attendance section in Time Management
      case 'attendance':
      case 'schedule':
      case 'time-off':
        return (
          <TimeManagementSection 
            employee={employee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Payroll section  
      case 'payroll-info':
        return <PayrollSection employee={employee} handleEdit={handleEdit} />;

      // Finance sections
      case 'reimbursement':
      case 'cash-advance':
      case 'loan':
        return (
          <FinanceSection 
            employee={employee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Files section
      case 'files':
        return <FilesSection employee={employee} handleEdit={handleEdit} />;

      // Assets section
      case 'assets':
        return <AssetsSection employee={employee} handleEdit={handleEdit} />;

      // History sections
      case 'adjustment':
      case 'transfer':
      case 'npp':
      case 'reprimand':
        return (
          <HistorySection 
            employee={employee} 
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
        employee={employee} 
        activeTab={activeTab} 
        handleEdit={handleEdit} 
      />

      {/* Main content area */}
      <div className="flex-1">
        {renderSectionContent()}
      </div>
    </div>
  );
};
