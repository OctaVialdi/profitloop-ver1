
import React, { useState } from "react";
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
  ChevronRight 
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EmployeeDetailSidebarProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const EmployeeDetailSidebar: React.FC<EmployeeDetailSidebarProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  // General section state
  const [openGeneral, setOpenGeneral] = useState(true);
  
  // Collapsible sections state - All start as closed
  const [openTimeManagement, setOpenTimeManagement] = useState(false);
  const [openPayroll, setOpenPayroll] = useState(false);
  const [openFinance, setOpenFinance] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <div className="w-full md:w-64 space-y-4">
      <Card className="p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center text-xl font-medium relative">
            {employee.name.charAt(0)}
            <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1">
              <FileText size={14} />
            </div>
          </div>
        </Avatar>
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <p className="text-sm text-gray-500">{employee.jobPosition || "-"}</p>
      </Card>

      <Card>
        <div className="py-2">
          {/* General with dropdown */}
          <Collapsible open={openGeneral} onOpenChange={setOpenGeneral}>
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>General</span>
                </div>
                {openGeneral ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'personal' ? 'text-blue-600 font-medium' : 'text-gray-700'}`} 
                onClick={() => handleEdit('personal')}
              >
                Personal
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'employment' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('employment')}
              >
                Employment
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'education' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('education')}
              >
                Education & Experience
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Time Management with dropdown */}
          <Collapsible open={openTimeManagement} onOpenChange={setOpenTimeManagement}>
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>Time Management</span>
                </div>
                {openTimeManagement ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'attendance' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('attendance')}
              >
                Attendance
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'schedule' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('schedule')}
              >
                Schedule
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'time-off' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('time-off')}
              >
                Time Off
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Payroll with dropdown */}
          <Collapsible open={openPayroll} onOpenChange={setOpenPayroll}>
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <CircleDollarSign size={16} className="mr-2" />
                  <span>Payroll</span>
                </div>
                {openPayroll ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'payroll-info' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('payroll-info')}
              >
                Payroll Info
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Finance with dropdown */}
          <Collapsible open={openFinance} onOpenChange={setOpenFinance}>
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet size={16} className="mr-2" />
                  <span>Finance</span>
                </div>
                {openFinance ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'reimbursement' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('reimbursement')}
              >
                Reimbursement
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'cash-advance' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('cash-advance')}
              >
                Cash Advance
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'loan' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('loan')}
              >
                Loan
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Files link */}
          <div 
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${activeTab === 'files' ? 'bg-gray-50' : ''}`}
            onClick={() => handleEdit('files')}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              <span className={activeTab === 'files' ? 'text-blue-600 font-medium' : ''}>Files</span>
            </div>
            <ChevronRight size={16} />
          </div>

          {/* Assets link */}
          <div 
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${activeTab === 'assets' ? 'bg-gray-50' : ''}`}
            onClick={() => handleEdit('assets')}
          >
            <div className="flex items-center">
              <Boxes size={16} className="mr-2" />
              <span className={activeTab === 'assets' ? 'text-blue-600 font-medium' : ''}>Assets</span>
            </div>
            <ChevronRight size={16} />
          </div>

          {/* History with dropdown */}
          <Collapsible open={openHistory} onOpenChange={setOpenHistory}>
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 size={16} className="mr-2" />
                  <span>History</span>
                </div>
                {openHistory ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'adjustment' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('adjustment')}
              >
                Adjustment
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'transfer' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('transfer')}
              >
                Transfer
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'npp' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('npp')}
              >
                NPP
              </div>
              <div 
                className={`pl-10 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'reprimand' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => handleEdit('reprimand')}
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
