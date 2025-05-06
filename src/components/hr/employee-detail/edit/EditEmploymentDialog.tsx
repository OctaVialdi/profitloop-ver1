import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LegacyEmployee, EmployeeEmployment } from "@/hooks/useEmployees";
import { updateEmployeeEmployment } from "@/services/employeeService";

interface EditEmploymentDialogProps {
  open: boolean;
  employee: LegacyEmployee;
  onClose: () => void;
  onSave: () => void;
}

export const EditEmploymentDialog = ({
  open,
  employee,
  onClose,
  onSave
}: EditEmploymentDialogProps) => {
  const [formValues, setFormValues] = useState({
    barcode: employee.barcode || "",
    organization_name: employee.organization || "",
    jobPosition: employee.jobPosition || "",
    jobLevel: employee.jobLevel || "",
    employmentStatus: employee.employmentStatus || "",
    branch: employee.branch || ""
  });

  const [joinDate, setJoinDate] = useState<Date | undefined>(
    employee.joinDate ? new Date(employee.joinDate) : undefined
  );
  
  const [signDate, setSignDate] = useState<Date | undefined>(
    employee.signDate ? new Date(employee.signDate) : undefined
  );
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const updatedData: Partial<EmployeeEmployment> = {
        barcode: formValues.barcode,
        organization_name: formValues.organization_name,
        job_position: formValues.jobPosition,
        job_level: formValues.jobLevel,
        employment_status: formValues.employmentStatus,
        branch: formValues.branch,
        join_date: joinDate ? format(joinDate, 'yyyy-MM-dd') : null,
        sign_date: signDate ? format(signDate, 'yyyy-MM-dd') : null
      };
      
      await updateEmployeeEmployment(employee.id, updatedData);
      
      toast.success("Employment details updated successfully");
      onSave();
    } catch (error) {
      console.error("Failed to update employment details:", error);
      toast.error("Failed to update employment details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Employment Data</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formValues.barcode}
              onChange={handleInputChange}
              placeholder="Enter barcode"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization name</Label>
              <Input
                id="organization_name"
                value={formValues.organization_name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={formValues.branch}
                onChange={handleInputChange}
                placeholder="Enter branch"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobPosition">Job position</Label>
              <Input
                id="jobPosition"
                value={formValues.jobPosition}
                onChange={handleInputChange}
                placeholder="Enter job position"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job level</Label>
              <Input
                id="jobLevel"
                value={formValues.jobLevel}
                onChange={handleInputChange}
                placeholder="Enter job level"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Employment status</Label>
            <Select
              value={formValues.employmentStatus}
              onValueChange={(value) => handleSelectChange("employmentStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Join date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !joinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {joinDate ? format(joinDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={joinDate}
                    onSelect={setJoinDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Sign date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !signDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {signDate ? format(signDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={signDate}
                    onSelect={setSignDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
