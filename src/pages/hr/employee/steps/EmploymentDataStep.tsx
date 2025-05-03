
import React, { useState } from "react";
import { FormValues, SBUItem } from "../types";
import { BasicInfoSection } from "../components/employment/BasicInfoSection";
import { DateSelectionSection } from "../components/employment/DateSelectionSection";
import { OrganizationSection } from "../components/employment/OrganizationSection";
import { JobDetailsSection } from "../components/employment/JobDetailsSection";
import { ScheduleApprovalSection } from "../components/employment/ScheduleApprovalSection";
import { SBUManagement } from "../components/SBUManagement";

interface EmploymentDataStepProps {
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  joinDate: Date | undefined;
  setJoinDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  signDate: Date | undefined;
  setSignDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  sbuList: SBUItem[];
  setSBUList: React.Dispatch<React.SetStateAction<SBUItem[]>>;
  handleAddSBU: () => void;
  handleRemoveSBU: (index: number) => void;
  handleSaveSBU: (index: number, group: string, name: string) => void;
  setNewStatusDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewOrgDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPositionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewLevelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmploymentDataStep: React.FC<EmploymentDataStepProps> = ({
  formValues,
  handleInputChange,
  handleSelectChange,
  joinDate,
  setJoinDate,
  signDate,
  setSignDate,
  sbuList,
  setSBUList,
  handleAddSBU,
  handleRemoveSBU,
  handleSaveSBU,
  setNewStatusDialogOpen,
  setNewOrgDialogOpen,
  setNewPositionDialogOpen,
  setNewLevelDialogOpen,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Employment data</h2>
        <p className="text-sm text-gray-500 mb-4">Fill all employee data information related to company</p>
      </div>
      
      {/* Basic information section */}
      <BasicInfoSection 
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        setNewStatusDialogOpen={setNewStatusDialogOpen}
      />
      
      {/* Date selection section */}
      <DateSelectionSection 
        joinDate={joinDate}
        setJoinDate={setJoinDate}
        signDate={signDate}
        setSignDate={setSignDate}
      />
      
      {/* Organization section */}
      <OrganizationSection 
        formValues={formValues}
        handleSelectChange={handleSelectChange}
        setNewOrgDialogOpen={setNewOrgDialogOpen}
      />
      
      {/* Job details section */}
      <JobDetailsSection 
        formValues={formValues}
        handleSelectChange={handleSelectChange}
        setNewPositionDialogOpen={setNewPositionDialogOpen}
        setNewLevelDialogOpen={setNewLevelDialogOpen}
      />
      
      {/* Schedule and approval section */}
      <ScheduleApprovalSection 
        formValues={formValues}
        handleSelectChange={handleSelectChange}
      />
      
      {/* SBU Management */}
      <SBUManagement 
        sbuList={sbuList}
        handleAddSBU={handleAddSBU}
        handleRemoveSBU={handleRemoveSBU}
        handleSaveSBU={handleSaveSBU}
      />
    </div>
  );
};
