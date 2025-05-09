
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import EmployeeTable from "@/components/hr/employee/EmployeeTable";
import ReprimandTab from "@/components/hr/company/ReprimandTab";
import ChangeHistoryTab from "@/components/hr/company/ChangeHistoryTab";

export default function HRDataKaryawan() {
  const [activeTab, setActiveTab] = useState("employees");
  const tabs = [
    {
      id: "employees",
      label: "Employees"
    }, 
    {
      id: "reprimand",
      label: "Reprimand"
    }, 
    {
      id: "history",
      label: "Change History"
    }
  ];

  return (
    <div className="space-y-3">
      {/* Breadcrumbs at the top */}
      <div className="flex justify-between items-center">
        <BreadcrumbNav 
          showHomeIcon={true}
          customLabels={{ "data": "Employee Data" }}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Header with Add Employee button */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">Employee Data</h1>
        
        {activeTab === "employees" && 
          <Link to="/hr/data/add-employee">
            <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        }
      </div>
      
      {/* Data Tabs - Modernized with gradient highlight */}
      <div className="relative border-b overflow-x-auto">
        <div className="flex space-x-1 pb-px mb-px">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-4 py-2 text-sm font-medium transition-colors relative
                ${activeTab === tab.id 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab content with improved loading states */}
      <div className="pt-2">
        {activeTab === "employees" && <EmployeeTable />}
        {activeTab === "reprimand" && <ReprimandTab />}
        {activeTab === "history" && <ChangeHistoryTab />}
      </div>
    </div>
  );
}
