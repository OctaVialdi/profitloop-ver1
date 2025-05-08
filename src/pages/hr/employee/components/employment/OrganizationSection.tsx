
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

interface OrganizationSectionProps {
  formValues: FormValues;
  handleSelectChange: (name: string, value: string) => void;
  setNewOrgDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  formValues,
  handleSelectChange,
  setNewOrgDialogOpen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Select value={formValues.branch} onValueChange={(value) => handleSelectChange("branch", value)}>
          <SelectTrigger id="branch" className="w-full">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 opacity-70" />
                <Input placeholder="Search" className="h-8" />
              </div>
            </div>
            <SelectItem value="no-branch">No branch</SelectItem>
            <SelectItem value="pusat">Pusat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">
          Organization<span className="text-red-500">*</span>
        </Label>
        <Select value={formValues.organization} onValueChange={(value) => handleSelectChange("organization", value)}>
          <SelectTrigger id="organization" className="w-full">
            <SelectValue placeholder="Select organization" />
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
                onClick={() => setNewOrgDialogOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add new organization
              </Button>
            </div>
            <SelectItem value="org1">Organization 1</SelectItem>
            <SelectItem value="org2">Organization 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
