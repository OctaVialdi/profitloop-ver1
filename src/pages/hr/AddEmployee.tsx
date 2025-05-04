
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AddEmployeeForm from "./employee/components/AddEmployeeForm";

export default function AddEmployee() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Link to="/hr/data" className="flex items-center hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to employee list
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">Add Employee</h1>
      
      <AddEmployeeForm />
    </div>
  );
}
