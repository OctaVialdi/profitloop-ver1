
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "./personal/PersonalInfoForm";
import { EmptyTabContent } from "./EmptyTabContent";
import { FormValues } from "../types";

interface EmployeePersonalTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
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

export const EmployeePersonalTabs: React.FC<EmployeePersonalTabsProps> = ({
  activeTab,
  setActiveTab,
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
  return (
    <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
        <TabsTrigger 
          value="basic-info" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
        >
          Basic info
        </TabsTrigger>
        <TabsTrigger 
          value="family" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
        >
          Family
        </TabsTrigger>
        <TabsTrigger 
          value="emergency" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
        >
          Emergency contact
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info" className="pt-6">
        <PersonalInfoForm 
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
      </TabsContent>

      <TabsContent value="family" className="pt-6">
        <Card>
          <EmptyTabContent 
            title="There is no data to display" 
            description="Your family information data will be displayed here."
          />
        </Card>
      </TabsContent>

      <TabsContent value="emergency" className="pt-6">
        <Card>
          <EmptyTabContent 
            title="There is no data to display" 
            description="Your emergency contact data will be displayed here."
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};
