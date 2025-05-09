
import React from "react";
import { EmployeePersonalLayout } from "./components/EmployeePersonalLayout";
import { EmployeePersonalTabs } from "./components/EmployeePersonalTabs";
import { useEmployeePersonalForm } from "./hooks/useEmployeePersonalForm";

const EmployeePersonal = () => {
  const {
    id,
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
    handleCancel,
    navigate
  } = useEmployeePersonalForm();

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => navigate("/hr/data")}
          >
            Back to Employee List
          </button>
        </div>
      </div>
    );
  }

  return (
    <EmployeePersonalLayout id={id!} title="Personal">
      <EmployeePersonalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formValues={formValues}
        setFormValues={setFormValues}
        birthdate={birthdate}
        setBirthdate={setBirthdate}
        passportExpiry={passportExpiry}
        setPassportExpiry={setPassportExpiry}
        useResidentialAddress={useResidentialAddress}
        setUseResidentialAddress={setUseResidentialAddress}
        onSubmit={onSubmit}
        handleCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </EmployeePersonalLayout>
  );
};

export default EmployeePersonal;
