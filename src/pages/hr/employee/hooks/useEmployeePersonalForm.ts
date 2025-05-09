
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { updateEmployeePersonalDetails, updateEmployeeIdentityAddress } from "@/services/employeeService";

export function useEmployeePersonalForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useEmployees();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the employee with the matching ID
  const employee = employees.find(emp => emp.id === id);

  // Setup states for date fields
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    employee?.birth_date ? new Date(employee.birth_date) : undefined
  );
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(
    employee?.passport_expiry ? new Date(employee.passport_expiry) : undefined
  );
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);

  // Handle form state
  const [formValues, setFormValues] = useState({
    firstName: employee?.name?.split(' ')[0] || '',
    lastName: employee?.name?.split(' ').slice(1).join(' ') || '',
    email: employee?.email || '',
    mobilePhone: employee?.mobile_phone || '',
    phone: employee?.mobile_phone || '',
    birthPlace: employee?.birth_place || '',
    gender: employee?.gender || '',
    maritalStatus: employee?.marital_status || '',
    bloodType: employee?.blood_type || '',
    religion: employee?.religion || '',
    nik: employee?.nik || '',
    passportNumber: employee?.passport_number || '',
    passportExpiry: employee?.passport_expiry || '',
    postalCode: employee?.postal_code || '',
    citizenAddress: employee?.citizen_address || '',
    residentialAddress: employee?.address || ''
  });

  // Handle save changes
  const onSubmit = async (data: any) => {
    if (!employee || !id) {
      toast.error("Employee not found");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Updating employee with data:", data);
      
      // Update base employee data
      const baseUpdate = {
        id: id,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
      };

      // Update personal details data separately
      const personalDetailsData = {
        employee_id: id,
        mobile_phone: data.mobilePhone,
        birth_place: data.birthPlace,
        birth_date: data.birthDate,
        gender: data.gender,
        marital_status: data.maritalStatus,
        blood_type: data.bloodType,
        religion: data.religion
      };

      // Update identity address data separately
      const identityAddressData = {
        employee_id: id,
        nik: data.nik,
        passport_number: data.passportNumber,
        passport_expiry: data.passportExpiry,
        postal_code: data.postalCode,
        citizen_address: data.citizenAddress,
        residential_address: data.residentialAddress
      };
      
      console.log("Updating base employee data:", baseUpdate);
      console.log("Updating personal details:", personalDetailsData);
      console.log("Updating identity address:", identityAddressData);
      
      // First update the base employee data
      await updateEmployee(id, baseUpdate);
      
      // Then update the personal details data
      await updateEmployeePersonalDetails(id, personalDetailsData);
      
      // Then update the identity address data
      await updateEmployeeIdentityAddress(id, identityAddressData);
      
      toast.success("Personal data updated successfully");
      navigate(`/hr/data/employee/${id}`);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update personal data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/hr/data/employee/${id}`);
  };

  return {
    id,
    navigate,
    employee,
    formValues,
    setFormValues,
    activeTab,
    setActiveTab,
    isSubmitting,
    birthdate,
    setBirthdate,
    passportExpiry, 
    setPassportExpiry,
    useResidentialAddress,
    setUseResidentialAddress,
    onSubmit,
    handleCancel
  };
}
