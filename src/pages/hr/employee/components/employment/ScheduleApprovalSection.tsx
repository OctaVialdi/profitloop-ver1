
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../../types";

interface ScheduleApprovalSectionProps {
  formValues: FormValues;
  handleSelectChange: (name: string, value: string) => void;
}

export const ScheduleApprovalSection: React.FC<ScheduleApprovalSectionProps> = ({
  formValues,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
