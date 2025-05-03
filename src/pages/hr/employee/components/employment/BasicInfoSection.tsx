
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormValues } from "../../types";

interface BasicInfoSectionProps {
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setNewStatusDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formValues,
  handleInputChange,
  handleSelectChange,
  setNewStatusDialogOpen,
}) => {
  return (
    <div className="space-y-4">
      {/* Employee ID & Barcode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">
            Employee ID<span className="text-red-500">*</span>
          </Label>
          <Input 
            id="employeeId"
            name="employeeId"
            value={formValues.employeeId}
            onChange={handleInputChange}
            placeholder="Employee ID" 
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
          </div>
          <Input 
            id="barcode" 
            name="barcode"
            value={formValues.barcode}
            onChange={handleInputChange}
            placeholder="Barcode" 
          />
        </div>
      </div>
      
      {/* Group Structure & Employment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="groupStructure">Group structure</Label>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
          </div>
          <Select value={formValues.groupStructure} onValueChange={(value) => handleSelectChange("groupStructure", value)}>
            <SelectTrigger id="groupStructure" className="w-full">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-3 py-2 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4 opacity-70" />
                  <Input placeholder="Search" className="h-8" />
                </div>
              </div>
              <SelectItem value="group1">Group 1</SelectItem>
              <SelectItem value="group2">Group 2</SelectItem>
              <SelectItem value="group3">Group 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">
            Employment status<span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formValues.employmentStatus} 
            onValueChange={(value) => handleSelectChange("employmentStatus", value)}
          >
            <SelectTrigger id="employmentStatus" className="w-full">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-3 py-2 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4 opacity-70" />
                  <Input placeholder="Search" className="h-8" />
                </div>
                <Button 
                  variant="ghost" 
                  className="flex w-full items-center gap-2 py-1 text-blue-600"
                  onClick={() => setNewStatusDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add new status
                </Button>
              </div>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Probation">Probation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
