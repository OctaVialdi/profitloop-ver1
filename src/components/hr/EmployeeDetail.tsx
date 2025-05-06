import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { employeeService, Employee } from "@/services/employeeService";
import { convertToLegacyFormat, LegacyEmployee } from "@/hooks/useEmployees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DefaultSection,
  FamilySection
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
  const [activePersonalTab, setActivePersonalTab] = useState("basic-info");
  const [employeeData, setEmployeeData] = useState<Employee>(employee);

  // Convert to legacy employee object format for backward compatibility
  const legacyEmployee: LegacyEmployee = convertToLegacyFormat(employeeData);

  // Handle edit button click
  const handleEdit = async (section: string) => {
    if (section === "refresh") {
      try {
        // Use fetchEmployees and find by ID instead of fetchEmployeeById
        const employees = await employeeService.fetchEmployees();
        const refreshedEmployee = employees.find(emp => emp.id === employee.id);
        
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
          <Tabs
            defaultValue="basic-info"
            value={activePersonalTab}
            onValueChange={setActivePersonalTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info" className="mt-6 space-y-6">
              <PersonalSection employee={legacyEmployee} handleEdit={handleEdit} />
              <IdentityAddressSection employee={legacyEmployee} handleEdit={handleEdit} />
            </TabsContent>
            
            <TabsContent value="family" className="mt-6">
              <FamilySection employee={legacyEmployee} handleEdit={handleEdit} />
            </TabsContent>
          </Tabs>
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
