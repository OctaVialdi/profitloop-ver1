
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

interface JobDetailsSectionProps {
  formValues: FormValues;
  handleSelectChange: (name: string, value: string) => void;
  setNewPositionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewLevelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  formValues,
  handleSelectChange,
  setNewPositionDialogOpen,
  setNewLevelDialogOpen,
}) => {
  return (
    <div className="space-y-4">
      {/* Job Position & Job Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobPosition">
            Job position<span className="text-red-500">*</span>
          </Label>
          <Select value={formValues.jobPosition} onValueChange={(value) => handleSelectChange("jobPosition", value)}>
            <SelectTrigger id="jobPosition" className="w-full">
              <SelectValue placeholder="Select job position" />
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
                  onClick={() => setNewPositionDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add new job position
                </Button>
              </div>
              <SelectItem value="pos1">Position 1</SelectItem>
              <SelectItem value="pos2">Position 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobLevel">
            Job level<span className="text-red-500">*</span>
          </Label>
          <Select value={formValues.jobLevel} onValueChange={(value) => handleSelectChange("jobLevel", value)}>
            <SelectTrigger id="jobLevel" className="w-full">
              <SelectValue placeholder="Select job level" />
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
                  onClick={() => setNewLevelDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add new job level
                </Button>
              </div>
              <SelectItem value="level1">Level 1</SelectItem>
              <SelectItem value="level2">Level 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Grade & Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Select value={formValues.grade} onValueChange={(value) => handleSelectChange("grade", value)}>
            <SelectTrigger id="grade" className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade1">Grade 1</SelectItem>
              <SelectItem value="grade2">Grade 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={formValues.class} onValueChange={(value) => handleSelectChange("class", value)}>
            <SelectTrigger id="class" className="w-full">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class1">Class 1</SelectItem>
              <SelectItem value="class2">Class 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
