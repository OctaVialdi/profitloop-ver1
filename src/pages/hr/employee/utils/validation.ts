
import { FormValues } from "../types";

export const validateEmployeeData = (
  formValues: FormValues, 
  section: "personal" | "employment" | "all"
): string[] => {
  const errors: string[] = [];

  // Personal section validations
  if (section === "personal" || section === "all") {
    if (!formValues.firstName) {
      errors.push("First name is required");
    }
    
    if (!formValues.email) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formValues.gender) {
      errors.push("Gender is required");
    }
    
    if (!formValues.maritalStatus) {
      errors.push("Marital status is required");
    }
    
    if (!formValues.religion) {
      errors.push("Religion is required");
    }
  }

  // Employment section validations
  if (section === "employment" || section === "all") {
    if (!formValues.employeeId) {
      errors.push("Employee ID is required");
    }
    
    if (!formValues.organization) {
      errors.push("Organization is required");
    }
    
    if (!formValues.jobPosition) {
      errors.push("Job position is required");
    }
    
    if (!formValues.jobLevel) {
      errors.push("Job level is required");
    }
    
    if (!formValues.employmentStatus) {
      errors.push("Employment status is required");
    }
    
    if (!formValues.branch) {
      errors.push("Branch is required");
    }
  }

  return errors;
};
