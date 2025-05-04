
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../../types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SimpleEmploymentSectionProps {
  formValues: FormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  joinDate: Date | undefined;
  setJoinDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const SimpleEmploymentSection: React.FC<SimpleEmploymentSectionProps> = ({
  formValues,
  handleInputChange,
  handleSelectChange,
  joinDate,
  setJoinDate
}) => {
  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID<span className="text-red-500">*</span></Label>
          <Input 
            id="employeeId"
            name="employeeId"
            placeholder="Enter employee ID"
            value={formValues.employeeId || ''} 
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input 
            id="barcode"
            name="barcode"
            placeholder="Employee barcode"
            value={formValues.barcode || ''} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      {/* Organization and Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organization">Organization<span className="text-red-500">*</span></Label>
          <Select
            value={formValues.organization || ""}
            onValueChange={(value) => handleSelectChange("organization", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobPosition">Job Position<span className="text-red-500">*</span></Label>
          <Select
            value={formValues.jobPosition || ""}
            onValueChange={(value) => handleSelectChange("jobPosition", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Director">Director</SelectItem>
              <SelectItem value="Assistant">Assistant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Status and Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Status<span className="text-red-500">*</span></Label>
          <Select 
            value={formValues.employmentStatus || "Permanent"}
            onValueChange={(value) => handleSelectChange("employmentStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Probation">Probation</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Branch<span className="text-red-500">*</span></Label>
          <Select
            value={formValues.branch || "Pusat"}
            onValueChange={(value) => handleSelectChange("branch", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pusat">Pusat</SelectItem>
              <SelectItem value="Cabang 1">Cabang 1</SelectItem>
              <SelectItem value="Cabang 2">Cabang 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Job Level and Join Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobLevel">Job Level<span className="text-red-500">*</span></Label>
          <Select
            value={formValues.jobLevel || ""}
            onValueChange={(value) => handleSelectChange("jobLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Staff">Staff</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="General Manager">General Manager</SelectItem>
              <SelectItem value="Director">Director</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="joinDate">Join Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {joinDate ? (
                  format(joinDate, "PPP")
                ) : (
                  <span className="text-gray-400">Select date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={joinDate}
                onSelect={setJoinDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
