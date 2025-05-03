
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SBUManagement } from "../components/SBUManagement";
import { FormValues, SBUItem } from "../types";

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
      
      {/* Join Date & Sign Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="joinDate">
            Join date<span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="joinDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {joinDate ? (
                  format(joinDate, "dd MMM yyyy")
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
        <div className="space-y-2">
          <Label htmlFor="signDate">Sign date</Label>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="shrink-0"
              onClick={() => setSignDate(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="signDate"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {signDate ? (
                    format(signDate, "dd MMM yyyy")
                  ) : (
                    <span className="text-gray-400">Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={signDate}
                  onSelect={setSignDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {/* Branch & Organization */}
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
              <SelectItem value="No branch">No branch</SelectItem>
              <SelectItem value="Pusat">Pusat</SelectItem>
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
      
      {/* Schedule */}
      <div className="space-y-2">
        <Label htmlFor="schedule">
          Schedule<span className="text-red-500">*</span>
        </Label>
        <Select value={formValues.schedule} onValueChange={(value) => handleSelectChange("schedule", value)}>
          <SelectTrigger id="schedule" className="w-full">
            <SelectValue placeholder="Select schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="schedule1">Office Hour (9 AM - 5 PM)</SelectItem>
            <SelectItem value="schedule2">Shift 1 (7 AM - 3 PM)</SelectItem>
            <SelectItem value="schedule3">Shift 2 (3 PM - 11 PM)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Approval Line & Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="approvalLine">Approval line</Label>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
          </div>
          <Select value={formValues.approvalLine} onValueChange={(value) => handleSelectChange("approvalLine", value)}>
            <SelectTrigger id="approvalLine" className="w-full">
              <SelectValue placeholder="Select approval line" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approvalLine1">Approval Line 1</SelectItem>
              <SelectItem value="approvalLine2">Approval Line 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="manager">Manager</Label>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
          </div>
          <Select value={formValues.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
            <SelectTrigger id="manager" className="w-full">
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager1">John Doe</SelectItem>
              <SelectItem value="manager2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
