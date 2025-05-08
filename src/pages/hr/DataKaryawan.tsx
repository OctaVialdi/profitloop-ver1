import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import EmployeeTable from "@/components/hr/employee/EmployeeTable";
import ChangeHistoryTab from "@/components/hr/company/ChangeHistoryTab";
export default function HRDataKaryawan() {
  const [activeTab, setActiveTab] = useState("employees");
  const tabs = [{
    id: "employees",
    label: "Employees"
  }, {
    id: "history",
    label: "Change History"
  }];
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Data</h1>
        {activeTab === "employees" && <Link to="/hr/data/add-employee">
            
          </Link>}
      </div>
      
      {/* Data Tabs */}
      <div className="flex space-x-1 border-b overflow-x-auto pb-px mb-4">
        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm transition-colors rounded-t-lg ${activeTab === tab.id ? "bg-primary text-primary-foreground border-b-2 border-primary font-medium" : "hover:bg-muted"}`}>
            {tab.label}
          </button>)}
      </div>
      
      {activeTab === "employees" && <EmployeeTable />}
      {activeTab === "history" && <ChangeHistoryTab />}
    </div>;
}