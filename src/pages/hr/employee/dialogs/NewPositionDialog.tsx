
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

interface NewPositionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: () => void;
  handleSubmitAndAddAnother: () => void;
}

export const NewPositionDialog: React.FC<NewPositionDialogProps> = ({
  open,
  setOpen,
  formValues,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  handleSubmitAndAddAnother,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create job position</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="positionCode">Job position code</Label>
            <Input 
              id="positionCode" 
              name="positionCode"
              value={formValues.positionCode}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="positionName">Job position name<span className="text-red-500">*</span></Label>
            <Input 
              id="positionName" 
              name="positionName"
              value={formValues.positionName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="parentPosition">Parent job position</Label>
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
            </div>
            <Select value={formValues.parentPosition} onValueChange={(value) => handleSelectChange("parentPosition", value)}>
              <SelectTrigger id="parentPosition">
                <SelectValue placeholder="Select parent job position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parentPos1">Parent Position 1</SelectItem>
                <SelectItem value="parentPos2">Parent Position 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Save</Button>
          <Button type="button" onClick={handleSubmitAndAddAnother}>Save and add other</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
