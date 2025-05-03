
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
  DefaultSection,
  EditablePersonalSection,
  EditableEmploymentSection,
  EditableEducationSection,
  EditableFilesSection,
  EditableAssetsSection
} from "./employee-detail";

interface EmployeeDetailProps {
  employee: Employee;
  activeTab: string;
  updateEmployee?: (updatedEmployee: Employee) => void;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ 
  employee,
  activeTab: initialActiveTab = "personal",
  updateEmployee
}) => {
  const navigate = useNavigate();
  const [activeTab] = useState(initialActiveTab);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);

  // Handle edit button click
  const handleEdit = (section: string) => {
    setEditMode(section);
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setEditMode(null);
  };
  
  // Handle save changes
  const handleSave = (updatedEmployee: Employee) => {
    setCurrentEmployee(updatedEmployee);
    
    if (updateEmployee) {
      updateEmployee(updatedEmployee);
    }
    
    toast.success("Data updated successfully");
    setEditMode(null);
  };
  
  // Handle save for sections with no data yet
  const handleSaveEmpty = () => {
    toast.success("Data updated successfully");
    setEditMode(null);
  };

  // Render content for each section
  const renderSectionContent = () => {
    switch (activeTab) {
      case 'personal':
        return editMode === 'personal' ? (
          <EditablePersonalSection 
            employee={currentEmployee} 
            handleCancel={handleCancel}
            handleSave={handleSave} 
          />
        ) : (
          <PersonalSection employee={currentEmployee} handleEdit={handleEdit} />
        );
        
      case 'employment':
        return editMode === 'employment' ? (
          <EditableEmploymentSection 
            employee={currentEmployee} 
            handleCancel={handleCancel}
            handleSave={handleSave} 
          />
        ) : (
          <EmploymentSection employee={currentEmployee} handleEdit={handleEdit} />
        );
        
      case 'education':
        return editMode === 'education' ? (
          <EditableEducationSection 
            employee={currentEmployee} 
            handleCancel={handleCancel}
            handleSave={handleSaveEmpty} 
          />
        ) : (
          <EducationSection employee={currentEmployee} handleEdit={handleEdit} />
        );

      // Attendance section in Time Management
      case 'attendance':
      case 'schedule':
      case 'time-off':
        return (
          <TimeManagementSection 
            employee={currentEmployee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Payroll section  
      case 'payroll-info':
        return <PayrollSection employee={currentEmployee} handleEdit={handleEdit} />;

      // Finance sections
      case 'reimbursement':
      case 'cash-advance':
      case 'loan':
        return (
          <FinanceSection 
            employee={currentEmployee} 
            activeTab={activeTab} 
            handleEdit={handleEdit} 
          />
        );

      // Files section
      case 'files':
        return editMode === 'files' ? (
          <EditableFilesSection 
            employee={currentEmployee} 
            handleCancel={handleCancel}
            handleSave={handleSaveEmpty} 
          />
        ) : (
          <FilesSection employee={currentEmployee} handleEdit={handleEdit} />
        );

      // Assets section
      case 'assets':
        return editMode === 'assets' ? (
          <EditableAssetsSection 
            employee={currentEmployee} 
            handleCancel={handleCancel}
            handleSave={handleSaveEmpty} 
          />
        ) : (
          <AssetsSection employee={currentEmployee} handleEdit={handleEdit} />
        );

      // History sections
      case 'adjustment':
      case 'transfer':
      case 'npp':
      case 'reprimand':
        return (
          <HistorySection 
            employee={currentEmployee} 
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
        employee={currentEmployee} 
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
