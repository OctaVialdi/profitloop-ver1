
import React from "react";
import OrganizationForm from "@/components/onboarding/OrganizationForm";
import LoadingState from "@/components/onboarding/LoadingState";
import { useOrganizationSetup } from "@/hooks/useOrganizationSetup";

const OrganizationSetup: React.FC = () => {
  const { formData, handleChange, handleSubmit, isLoading, isChecking } = useOrganizationSetup();

  if (isChecking) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <OrganizationForm 
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrganizationSetup;
