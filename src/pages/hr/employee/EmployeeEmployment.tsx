
import React, { useState } from "react";
import { useNavigate, useSearchParams, useOutletContext, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { EmploymentDataStep } from "./steps/EmploymentDataStep";
import { FormValues, SBUItem } from "./types";

const EmployeeEmployment = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get("id");
  
  // Use either the URL parameter, outlet context, or route parameter
  const id = urlId || (useOutletContext<{ employeeId?: string }>()?.employeeId) || paramId;
  
  const { employees } = useEmployees();
  const employee = employees.find(emp => emp.id === id);
  
  const [joinDate, setJoinDate] = useState<Date | undefined>(
    employee?.joinDate ? new Date(employee.joinDate) : undefined
  );
  
  const [signDate, setSignDate] = useState<Date | undefined>(
    employee?.signDate ? new Date(employee.signDate) : undefined
  );
  
  const [sbuList, setSBUList] = useState<SBUItem[]>([]);
  const [newStatusDialogOpen, setNewStatusDialogOpen] = useState(false);
  const [newOrgDialogOpen, setNewOrgDialogOpen] = useState(false);
  const [newPositionDialogOpen, setNewPositionDialogOpen] = useState(false);
  const [newLevelDialogOpen, setNewLevelDialogOpen] = useState(false);
  
  // Initialize with explicit default values for all required FormValues properties
  const [formValues, setFormValues] = useState<FormValues>({
    // Basic employment info
    employeeId: employee?.employeeId || "",
    barcode: employee?.barcode || "",
    organization: employee?.organization || "",
    jobPosition: employee?.jobPosition || "",
    jobLevel: employee?.jobLevel || "",
    employmentStatus: employee?.employmentStatus || "Permanent",
    branch: employee?.branch || "Pusat",
    
    // Default empty values for all other required fields
    groupStructure: "",
    grade: "",
    class: "",
    schedule: "",
    approvalLine: "",
    manager: "",
    
    // Personal info fields (not used in this component but required by type)
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    phone: "",
    birthPlace: "",
    gender: "",
    maritalStatus: "",
    bloodType: "",
    religion: "",
    
    // Extra required fields for dialogs
    statusName: "",
    statusHasEndDate: false,
    orgCode: "",
    orgName: "",
    parentOrg: "",
    positionCode: "",
    positionName: "",
    parentPosition: "",
    levelCode: "",
    levelName: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSBU = () => {
    setSBUList([...sbuList, { group: "", name: "" }]);
  };
  
  const handleRemoveSBU = (index: number) => {
    const newList = [...sbuList];
    newList.splice(index, 1);
    setSBUList(newList);
  };
  
  const handleSaveSBU = (index: number, group: string, name: string) => {
    const newList = [...sbuList];
    newList[index] = { group, name };
    setSBUList(newList);
  };
  
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
          <h1 className="text-2xl font-bold">Edit Employment Details</h1>
          <p className="text-gray-500">Update {employee.name}'s employment information</p>
        </div>

        <EmploymentDataStep
          formValues={formValues}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          joinDate={joinDate}
          setJoinDate={setJoinDate}
          signDate={signDate}
          setSignDate={setSignDate}
          sbuList={sbuList}
          setSBUList={setSBUList}
          handleAddSBU={handleAddSBU}
          handleRemoveSBU={handleRemoveSBU}
          handleSaveSBU={handleSaveSBU}
          setNewStatusDialogOpen={setNewStatusDialogOpen}
          setNewOrgDialogOpen={setNewOrgDialogOpen}
          setNewPositionDialogOpen={setNewPositionDialogOpen}
          setNewLevelDialogOpen={setNewLevelDialogOpen}
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

export default EmployeeEmployment;
