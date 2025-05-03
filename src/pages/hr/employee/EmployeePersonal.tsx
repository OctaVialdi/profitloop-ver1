
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { useEmployees } from "@/hooks/useEmployees";
import { FormValues } from "./types";

const EmployeePersonal = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get("id");
  
  // Use either the URL parameter, outlet context, or route parameter
  const id = urlId || (useOutletContext<{ employeeId?: string }>()?.employeeId) || paramId;
  
  const { employees } = useEmployees();
  const employee = employees.find(emp => emp.id === id);
  
  // State for form values
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    employee?.birthDate ? new Date(employee.birthDate) : undefined
  );
  
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(undefined);
  const [useResidentialAddress, setUseResidentialAddress] = useState<boolean>(false);
  
  // Initialize with a partial FormValues that only includes personal fields
  // This avoids TypeScript errors by making it explicit we're only dealing with a subset
  const [formValues, setFormValues] = useState<Partial<FormValues>>({
    firstName: employee?.name?.split(" ")[0] || "",
    lastName: employee?.name?.split(" ").slice(1).join(" ") || "",
    email: employee?.email || "",
    mobilePhone: employee?.mobilePhone || "",
    phone: employee?.mobilePhone || "", // Default to mobilePhone if phone isn't available
    birthPlace: employee?.birthPlace || "",
    gender: employee?.gender || "male",
    maritalStatus: employee?.maritalStatus || "single",
    bloodType: employee?.maritalStatus || "", // Default to empty string if bloodType isn't available
    religion: employee?.religion || ""
  });
  
  const handleSave = () => {
    // Handle save logic here
    navigate(`/hr/data/employee/${id}`);
  };
  
  const handleCancel = () => {
    navigate(`/hr/data/employee/${id}`);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate(`/hr/data/employee/${id}`)}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee Detail</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Personal Details</h1>
          <p className="text-gray-500">Update {employee.name}'s personal information</p>
        </div>

        <PersonalDataStep
          formValues={formValues as any}
          setFormValues={setFormValues as any}
          birthdate={birthdate}
          setBirthdate={setBirthdate}
          passportExpiry={passportExpiry}
          setPassportExpiry={setPassportExpiry}
          useResidentialAddress={useResidentialAddress}
          setUseResidentialAddress={setUseResidentialAddress}
        />

        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployeePersonal;
