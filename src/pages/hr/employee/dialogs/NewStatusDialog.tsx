
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { FormValues } from "../types";

interface NewStatusDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean, name: string) => void;
  handleSubmit: () => void;
}

export const NewStatusDialog: React.FC<NewStatusDialogProps> = ({
  open,
  setOpen,
  formValues,
  handleInputChange,
  handleCheckboxChange,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new status</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="statusName">Name<span className="text-red-500">*</span></Label>
            <Input 
              id="statusName" 
              name="statusName"
              value={formValues.statusName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasEndDate" 
              checked={formValues.statusHasEndDate}
              onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "statusHasEndDate")}
            />
            <Label 
              htmlFor="hasEndDate" 
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This status have end date<br />(eg. contract, probation etc)
            </Label>
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
