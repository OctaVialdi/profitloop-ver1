
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { FormValues } from "./employee/types";
import { employeeService } from "@/services/employeeService";
import { toast } from "sonner";
import { validateEmployeeData } from "./employee/utils/validation";
import { SimplePersonalSection } from "./employee/components/simple/SimplePersonalSection";
import { SimpleEmploymentSection } from "./employee/components/simple/SimpleEmploymentSection";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";

export default function AddEmployee() {
  const navigate = useNavigate();
  const { userProfile } = useOrganization();
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Date states
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(undefined);
  const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());
  const [signDate, setSignDate] = useState<Date | undefined>(new Date());
  
  // Initialize formValues with all required properties from FormValues type
  const [formValues, setFormValues] = useState<FormValues>({
    // Personal information
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    phone: "",
    birthPlace: "",
    gender: "male", // Set default value
    maritalStatus: "single", // Set default value
    bloodType: "",
    religion: "islam", // Set default value
    
    // Identity information
    nik: "",
    passportNumber: "",
    postalCode: "",
    citizenAddress: "",
    residentialAddress: "",
    useResidentialAddress: false,
    
    // Employment information
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
    
    // Dialog form fields
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
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const validateForm = (): boolean => {
    const errors = validateEmployeeData(formValues, "all");
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      console.log("Submitting employee data...");
      
      // Format the name from firstName and lastName
      const fullName = [formValues.firstName, formValues.lastName]
        .filter(Boolean)
        .join(" ");
        
      if (!fullName) {
        toast.error("Employee name is required");
        setIsSubmitting(false);
        return;
      }
      
      // Make sure we have an organization_id
      if (!userProfile?.organization_id) {
        toast.error("No organization found. Please refresh the page or contact support.");
        setIsSubmitting(false);
        return;
      }

      // Check if employee ID is unique for this organization
      const { data: existingEmployee, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .eq('employee_id', formValues.employeeId)
        .eq('organization_id', userProfile.organization_id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking employee ID uniqueness:", checkError);
      }

      if (existingEmployee) {
        toast.error("Employee ID already exists in your organization. Please use a different ID.");
        setIsSubmitting(false);
        return;
      }

      // Prepare employee data with explicit organization_id
      const employeeData = {
        name: fullName,
        email: formValues.email,
        employee_id: formValues.employeeId,
        status: "Active",
        organization_id: userProfile.organization_id
      };

      // Prepare personal details data - ensure all collected fields are included
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
        residential_address: formValues.residentialAddress
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
        manager_id: formValues.manager || undefined
      };

      console.log("Creating employee with data:", { 
        employeeData, 
        personalDetails, 
        identityAddress, 
        employment,
        organization_id: userProfile.organization_id
      });
      
      // Create employee with all details
      const result = await employeeService.createEmployee(
        employeeData,
        personalDetails,
        identityAddress,
        employment
      );
      
      if (!result) {
        toast.error("Failed to create employee");
        console.error("Employee creation returned null result");
        return;
      }
      
      console.log("Employee created successfully with ID:", result.id);
      toast.success("Employee created successfully");
      
      // Navigate back to employee list
      navigate(`/hr/data`);
      
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Link to="/hr/data" className="flex items-center hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to employee list
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">Add Employee</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Data Section */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Personal Data</h2>
            <p className="text-sm text-gray-500 mb-4">Basic employee personal information</p>
            
            <SimplePersonalSection 
              formValues={formValues}
              setFormValues={setFormValues}
              birthdate={birthdate}
              setBirthdate={setBirthdate}
              handleSelectChange={handleSelectChange}
            />
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-1">Employment Data</h2>
            <p className="text-sm text-gray-500 mb-4">Basic employment information</p>
            
            <SimpleEmploymentSection 
              formValues={formValues}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              joinDate={joinDate}
              setJoinDate={setJoinDate}
            />
          </div>
          
          {/* Advanced Options */}
          <Collapsible
            open={advancedOpen}
            onOpenChange={setAdvancedOpen}
            className="border-t pt-4"
          >
            <CollapsibleTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                className="flex w-full justify-between items-center"
              >
                <span className="text-left font-medium">Advanced Options</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${advancedOpen ? "transform rotate-180" : ""}`} 
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-4">
              <p className="text-sm text-gray-500">
                Additional information can be added later in the employee details page.
              </p>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 font-medium text-sm mb-1">Please correct the following errors:</p>
              <ul className="text-red-700 text-sm list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/hr/data')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Employee"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
