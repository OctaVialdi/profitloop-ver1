
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PersonalDataSection } from "./PersonalDataSection";
import { IdentityAddressSection } from "./IdentityAddressSection";
import { FormValues } from "../../types";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface PersonalInfoFormProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  passportExpiry: Date | undefined;
  setPassportExpiry: React.Dispatch<React.SetStateAction<Date | undefined>>;
  useResidentialAddress: boolean;
  setUseResidentialAddress: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: any) => Promise<void>;
  handleCancel: () => void;
  isSubmitting: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate,
  passportExpiry,
  setPassportExpiry,
  useResidentialAddress,
  setUseResidentialAddress,
  onSubmit,
  handleCancel,
  isSubmitting
}) => {
  // Setup form with default values
  const form = useForm({
    defaultValues: formValues
  });

  const handleSubmit = (data: any) => {
    // Include the date fields
    const updatedData = {
      ...data,
      birthDate: birthdate ? birthdate.toISOString().split('T')[0] : undefined,
      passportExpiry: passportExpiry ? passportExpiry.toISOString().split('T')[0] : undefined,
    };
    
    onSubmit(updatedData);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <PersonalDataSection 
            formValues={formValues}
            setFormValues={setFormValues}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
          />
          
          <div className="pt-4 border-t">
            <IdentityAddressSection 
              formValues={formValues}
              setFormValues={setFormValues}
              passportExpiry={passportExpiry}
              setPassportExpiry={setPassportExpiry}
              useResidentialAddress={useResidentialAddress}
              setUseResidentialAddress={setUseResidentialAddress}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
