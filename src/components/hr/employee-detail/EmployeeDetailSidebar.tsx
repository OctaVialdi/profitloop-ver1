import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Clock, 
  CircleDollarSign, 
  Wallet, 
  FileText, 
  Boxes, 
  BarChart2,
  ChevronDown,
  ChevronRight,
  Camera,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { EditProfilePhotoDialog } from "./edit/EditProfilePhotoDialog";
import { toast } from "sonner";
import { Employee } from "@/services/employeeService";

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
  // Profile photo dialog state
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  
  // Determine which sections should be initially open based on activeTab
  const isTimeManagementTab = ['attendance', 'schedule', 'time-off'].includes(activeTab);
  const isPayrollTab = ['payroll-info'].includes(activeTab);
  const isFinanceTab = ['reimbursement', 'cash-advance', 'loan'].includes(activeTab);
  const isHistoryTab = ['adjustment', 'transfer', 'npp', 'reprimand'].includes(activeTab);
  const isGeneralTab = ['personal', 'employment', 'education'].includes(activeTab);
  
  // General section state - open if activeTab is related to general
  const [openGeneral, setOpenGeneral] = useState(isGeneralTab);
  
  // Other sections state - open based on activeTab
  const [openTimeManagement, setOpenTimeManagement] = useState(isTimeManagementTab);
  const [openPayroll, setOpenPayroll] = useState(isPayrollTab);
  const [openFinance, setOpenFinance] = useState(isFinanceTab);
  const [openHistory, setOpenHistory] = useState(isHistoryTab);

  // Keep dropdown sections open when navigating between tabs
  useEffect(() => {
    if (isTimeManagementTab) setOpenTimeManagement(true);
    if (isPayrollTab) setOpenPayroll(true);
    if (isFinanceTab) setOpenFinance(true);
    if (isHistoryTab) setOpenHistory(true);
    if (isGeneralTab) setOpenGeneral(true);
  }, [activeTab, isTimeManagementTab, isPayrollTab, isFinanceTab, isHistoryTab, isGeneralTab]);

  // Toggle functions that don't automatically close dropdowns when clicking items inside
  const toggleGeneral = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenGeneral(!openGeneral);
  };

  const toggleTimeManagement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTimeManagement(!openTimeManagement);
  };

  const togglePayroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPayroll(!openPayroll);
  };

  const toggleFinance = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFinance(!openFinance);
  };

  const toggleHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenHistory(!openHistory);
  };

  // Navigation handler that prevents event bubbling
  const handleNavigation = (e: React.MouseEvent, section: string) => {
    e.stopPropagation();
    handleEdit(section);
  };

  // Open the photo dialog
  const openPhotoDialog = () => {
    setIsPhotoDialogOpen(true);
  };

  // Handle profile photo update
  const handlePhotoUpdated = (newPhotoUrl: string) => {
    handleEdit('refresh');
    toast.success('Profile photo updated successfully');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full md:w-64 space-y-4">
      <Card className="p-6 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2 group">
          <Avatar className="w-24 h-24 border-2 border-border">
            {employee.profile_image ? (
              <AvatarImage src={employee.profile_image} alt={employee.name} />
            ) : (
              <AvatarFallback className="text-xl font-medium bg-gray-200">
                {getInitials(employee.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {/* Photo upload overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full 
                      opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            onClick={openPhotoDialog}
          >
            <Camera className="h-6 w-6 text-white" />
            <span className="sr-only">Change photo</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <p className="text-sm text-gray-500">{employee.jobPosition || "-"}</p>
      </Card>

      {/* Photo upload dialog */}
      <EditProfilePhotoDialog
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
        employee={employee as unknown as Employee}
        onPhotoUpdated={handlePhotoUpdated}
      />

      <Card>
        <div className="py-2">
          {/* General with dropdown */}
          <Collapsible open={openGeneral}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={toggleGeneral}>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>General</span>
              </div>
              {openGeneral ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'personal' ? 'text-blue-600 font-medium' : 'text-gray-700'}`} 
                onClick={(e) => handleNavigation(e, 'personal')}
              >
                Personal
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'employment' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'employment')}
              >
                Employment
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'education' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'education')}
              >
                Education & Experience
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Time Management with dropdown */}
          <Collapsible open={openTimeManagement}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={toggleTimeManagement}>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>Time Management</span>
              </div>
              {openTimeManagement ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'attendance' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'attendance')}
              >
                Attendance
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'schedule' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'schedule')}
              >
                Schedule
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'time-off' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'time-off')}
              >
                Time Off
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Payroll with dropdown */}
          <Collapsible open={openPayroll}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={togglePayroll}>
              <div className="flex items-center">
                <CircleDollarSign size={16} className="mr-2" />
                <span>Payroll</span>
              </div>
              {openPayroll ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'payroll-info' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'payroll-info')}
              >
                Payroll Info
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Finance with dropdown */}
          <Collapsible open={openFinance}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={toggleFinance}>
              <div className="flex items-center">
                <Wallet size={16} className="mr-2" />
                <span>Finance</span>
              </div>
              {openFinance ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'reimbursement' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'reimbursement')}
              >
                Reimbursement
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'cash-advance' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'cash-advance')}
              >
                Cash Advance
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'loan' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'loan')}
              >
                Loan
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Files link */}
          <div 
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${activeTab === 'files' ? 'bg-gray-50' : ''}`}
            onClick={(e) => handleNavigation(e, 'files')}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              <span className={activeTab === 'files' ? 'text-blue-600 font-medium' : ''}>Files</span>
            </div>
          </div>

          {/* Assets link */}
          <div 
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${activeTab === 'assets' ? 'bg-gray-50' : ''}`}
            onClick={(e) => handleNavigation(e, 'assets')}
          >
            <div className="flex items-center">
              <Boxes size={16} className="mr-2" />
              <span className={activeTab === 'assets' ? 'text-blue-600 font-medium' : ''}>Assets</span>
            </div>
          </div>

          {/* History with dropdown */}
          <Collapsible open={openHistory}>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={toggleHistory}>
              <div className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                <span>History</span>
              </div>
              {openHistory ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'adjustment' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'adjustment')}
              >
                Adjustment
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'transfer' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'transfer')}
              >
                Transfer
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'npp' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'npp')}
              >
                NPP
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'reprimand' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={(e) => handleNavigation(e, 'reprimand')}
              >
                Reprimand
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </div>
  );
};
