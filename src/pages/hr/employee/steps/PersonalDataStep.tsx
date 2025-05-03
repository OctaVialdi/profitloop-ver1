
import React from "react";
import { FormValues } from "../types";
import { PersonalInfoSection } from "../components/personal/PersonalInfoSection";
import { IdentityAddressSection } from "../components/personal/IdentityAddressSection";

interface PersonalDataStepProps {
  formValues: Partial<FormValues>;
  setFormValues: React.Dispatch<React.SetStateAction<Partial<FormValues>>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  passportExpiry: Date | undefined;
  setPassportExpiry: React.Dispatch<React.SetStateAction<Date | undefined>>;
  useResidentialAddress: boolean;
  setUseResidentialAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate,
  passportExpiry,
  setPassportExpiry,
  useResidentialAddress,
  setUseResidentialAddress,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Personal data</h2>
        <p className="text-sm text-gray-500">Fill all employee personal basic information data</p>
      </div>
      
      {/* Personal information section */}
      <PersonalInfoSection 
        formValues={formValues}
        setFormValues={setFormValues}
        birthdate={birthdate}
        setBirthdate={setBirthdate}
      />
      
      {/* Identity and address section */}
      <div className="pt-4 border-t">
        <IdentityAddressSection 
          passportExpiry={passportExpiry}
          setPassportExpiry={setPassportExpiry}
          useResidentialAddress={useResidentialAddress}
          setUseResidentialAddress={setUseResidentialAddress}
        />
      </div>
    </div>
  );
};
