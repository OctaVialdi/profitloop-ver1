import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FormStep } from "./employee/FormSteps";
import { ProgressSteps } from "./employee/ProgressSteps";
import { StepNavigation } from "./employee/StepNavigation";
import { PersonalDataStep } from "./employee/steps/PersonalDataStep";
import { EmploymentDataStep } from "./employee/steps/EmploymentDataStep";
import { PayrollStep } from "./employee/steps/PayrollStep";
import { InviteStep } from "./employee/steps/InviteStep";
import { NewStatusDialog } from "./employee/dialogs/NewStatusDialog";
import { NewOrganizationDialog } from "./employee/dialogs/NewOrganizationDialog";
import { NewPositionDialog } from "./employee/dialogs/NewPositionDialog";
import { NewLevelDialog } from "./employee/dialogs/NewLevelDialog";
import { FormValues, SBUItem } from "./employee/types";

export default function AddEmployee() {
  // Step state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PERSONAL_DATA);
  
  // Date states
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(undefined);
  const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());
  const [signDate, setSignDate] = useState<Date | undefined>(new Date());
  
  // Personal data states
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);
  
  // SBU management state
  const [sbuList, setSBUList] = useState<SBUItem[]>([]);
  
  // Dialog states
  const [newStatusDialogOpen, setNewStatusDialogOpen] = useState(false);
  const [newOrgDialogOpen, setNewOrgDialogOpen] = useState(false);
  const [newPositionDialogOpen, setNewPositionDialogOpen] = useState(false);
  const [newLevelDialogOpen, setNewLevelDialogOpen] = useState(false);
  
  // Form values state
  const [formValues, setFormValues] = useState<FormValues>({
    employeeId: "",
    barcode: "",
    groupStructure: "",
    employmentStatus: "Permanent",
    branch: "Pusat",
    organization: "",
    jobPosition: "",
    jobLevel: "",
    grade: "",
    class: "",
    schedule: "",
    approvalLine: "",
    manager: "",
    statusName: "",
    statusHasEndDate: false,
    orgCode: "",
    orgName: "",
    parentOrg: "",
    positionCode: "",
    positionName: "",
    parentPosition: "",
    levelCode: "",
    levelName: "",
  });

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormValues({
      ...formValues,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleNextStep = () => {
    if (currentStep < FormStep.INVITE) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > FormStep.PERSONAL_DATA) {
      setCurrentStep(currentStep - 1);
    }
  };

  // SBU handlers
  const handleAddSBU = () => {
    // Add a new SBU placeholder to the list
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

  // Dialog handlers
  const handleCreateNewStatus = () => {
    // Handle creating new employment status
    setNewStatusDialogOpen(false);
    // Here you would typically add the new status to a list of available statuses
  };

  const handleCreateNewOrg = () => {
    // Handle creating new organization
    setNewOrgDialogOpen(false);
    // Here you would typically add the new organization to a list of available organizations
  };
  
  const handleCreateNewPosition = () => {
    // Handle creating new job position
    setNewPositionDialogOpen(false);
    // Here you would typically add the new position to a list of available positions
  };

  const handleCreateNewPositionAndAddAnother = () => {
    // Handle creating new job position and keep the dialog open
    // Here you would typically add the new position to a list of available positions
    // and clear the form for a new entry
    setFormValues({
      ...formValues,
      positionCode: "",
      positionName: "",
      parentPosition: ""
    });
  };
  
  const handleCreateNewLevel = () => {
    // Handle creating new job level
    setNewLevelDialogOpen(false);
    // Here you would typically add the new level to a list of available levels
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Link to="/hr/data" className="hover:underline">
          Employee list
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">Add employee</h1>
      
      {/* Progress Steps */}
      <ProgressSteps currentStep={currentStep} />
      
      <Card className="p-6">
        {/* Step content */}
        {currentStep === FormStep.PERSONAL_DATA && (
          <PersonalDataStep
            formValues={formValues}
            setFormValues={setFormValues}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            passportExpiry={passportExpiry}
            setPassportExpiry={setPassportExpiry}
            useResidentialAddress={useResidentialAddress}
            setUseResidentialAddress={setUseResidentialAddress}
          />
        )}
        
        {currentStep === FormStep.EMPLOYMENT_DATA && (
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
        )}
        
        {currentStep === FormStep.PAYROLL && <PayrollStep />}
        
        {currentStep === FormStep.INVITE && <InviteStep />}
        
        {/* Navigation buttons */}
        <StepNavigation
          currentStep={currentStep}
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
        />
      </Card>

      {/* Dialogs */}
      <NewStatusDialog
        open={newStatusDialogOpen}
        setOpen={setNewStatusDialogOpen}
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleCreateNewStatus}
      />
      
      <NewOrganizationDialog
        open={newOrgDialogOpen}
        setOpen={setNewOrgDialogOpen}
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSubmit={handleCreateNewOrg}
      />
      
      <NewPositionDialog
        open={newPositionDialogOpen}
        setOpen={setNewPositionDialogOpen}
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSubmit={handleCreateNewPosition}
        handleSubmitAndAddAnother={handleCreateNewPositionAndAddAnother}
      />
      
      <NewLevelDialog
        open={newLevelDialogOpen}
        setOpen={setNewLevelDialogOpen}
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreateNewLevel}
      />
    </div>
  );
}
