
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { employeeService } from "@/services/employeeService";
import { toast } from "sonner";
import { validateEmployeeData } from "./employee/utils/validation";

export default function AddEmployee() {
  const navigate = useNavigate();
  
  // Step state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PERSONAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
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

  const validateCurrentStep = () => {
    let errors: string[] = [];
    
    if (currentStep === FormStep.PERSONAL_DATA) {
      errors = validateEmployeeData(formValues, "personal");
    } else if (currentStep === FormStep.EMPLOYMENT_DATA) {
      errors = validateEmployeeData(formValues, "employment");
    } else if (currentStep === FormStep.INVITE) {
      errors = validateEmployeeData(formValues, "all");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      // Show the first error
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
      }
      return;
    }
    
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
    setNewStatusDialogOpen(false);
  };

  const handleCreateNewOrg = () => {
    setNewOrgDialogOpen(false);
  };
  
  const handleCreateNewPosition = () => {
    setNewPositionDialogOpen(false);
  };

  const handleCreateNewPositionAndAddAnother = () => {
    setFormValues({
      ...formValues,
      positionCode: "",
      positionName: "",
      parentPosition: ""
    });
  };
  
  const handleCreateNewLevel = () => {
    setNewLevelDialogOpen(false);
  };

  // Handle submit employee data
  const handleSubmitEmployee = async (withInvite: boolean = true): Promise<string | null> => {
    try {
      setIsSubmitting(true);
      console.log("Starting employee submission process...");
      
      // Validate all required fields
      const allErrors = validateEmployeeData(formValues, "all");
      if (allErrors.length > 0) {
        console.error("Validation errors:", allErrors);
        toast.error(allErrors[0]);
        setValidationErrors(allErrors);
        return null;
      }

      // Format the name from firstName and lastName
      const fullName = [formValues.firstName, formValues.lastName]
        .filter(Boolean)
        .join(" ");
        
      if (!fullName) {
        console.error("Employee name is required");
        toast.error("Employee name is required");
        return null;
      }

      // Prepare employee data
      const employeeData = {
        name: fullName,
        email: formValues.email,
        employee_id: formValues.employeeId,
        status: "Active"
      };

      // Prepare personal details data
      const personalDetails = {
        mobile_phone: formValues.mobilePhone,
        birth_place: formValues.birthPlace,
        birth_date: birthdate ? birthdate.toISOString() : undefined,
        gender: formValues.gender,
        marital_status: formValues.maritalStatus,
        religion: formValues.religion,
        blood_type: formValues.bloodType
      };

      // Prepare identity address data
      const identityAddress = {
        nik: formValues.nik,
        passport_number: formValues.passportNumber,
        passport_expiry: passportExpiry ? passportExpiry.toISOString() : undefined,
        postal_code: formValues.postalCode,
        citizen_address: formValues.citizenAddress,
        residential_address: useResidentialAddress && formValues.citizenAddress 
          ? formValues.citizenAddress 
          : formValues.residentialAddress
      };

      // Prepare employment data
      const employment = {
        barcode: formValues.barcode,
        organization: formValues.organization,
        job_position: formValues.jobPosition,
        job_level: formValues.jobLevel,
        employment_status: formValues.employmentStatus,
        branch: formValues.branch,
        join_date: joinDate ? joinDate.toISOString() : undefined,
        sign_date: signDate ? signDate.toISOString() : undefined,
        grade: formValues.grade,
        class: formValues.class,
        schedule: formValues.schedule,
        approval_line: formValues.approvalLine,
        manager_id: formValues.manager !== "No manager" ? formValues.manager : undefined,
      };

      console.log("Creating employee with data:", { 
        employeeData, 
        personalDetails, 
        identityAddress, 
        employment 
      });
      
      // Create employee with all details
      const result = await employeeService.createEmployee(
        employeeData,
        personalDetails,
        identityAddress,
        employment
      );
      
      if (!result) {
        console.error("Failed to create employee: No result returned");
        toast.error("Failed to create employee");
        return null;
      }
      
      console.log("Employee created successfully with ID:", result.id);
      toast.success("Employee created successfully");
      
      // If not sending invite, navigate back to employee list
      if (!withInvite) {
        navigate(`/hr/data/employee/${result.id}`);
      }
      
      return result.id;
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
      return null;
    } finally {
      setIsSubmitting(false);
    }
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
        
        {currentStep === FormStep.INVITE && (
          <InviteStep 
            formValues={formValues} 
            onSubmitEmployee={handleSubmitEmployee} 
            submitting={isSubmitting}
          />
        )}
        
        {/* Navigation buttons */}
        <StepNavigation
          currentStep={currentStep}
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
          handleSubmit={() => handleSubmitEmployee(true)}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
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
