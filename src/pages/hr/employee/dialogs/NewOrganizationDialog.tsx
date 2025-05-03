
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../types";

interface NewOrganizationDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: () => void;
}

export const NewOrganizationDialog: React.FC<NewOrganizationDialogProps> = ({
  open,
  setOpen,
  formValues,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new organization</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="orgCode">Organization code</Label>
            <Input 
              id="orgCode" 
              name="orgCode"
              value={formValues.orgCode}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization name<span className="text-red-500">*</span></Label>
            <Input 
              id="orgName" 
              name="orgName"
              value={formValues.orgName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="parentOrg">Parent organization</Label>
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
            </div>
            <Select value={formValues.parentOrg} onValueChange={(value) => handleSelectChange("parentOrg", value)}>
              <SelectTrigger id="parentOrg">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent1">Parent Org 1</SelectItem>
                <SelectItem value="parent2">Parent Org 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
