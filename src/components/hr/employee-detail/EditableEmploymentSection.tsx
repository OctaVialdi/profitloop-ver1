
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EditableEmploymentSectionProps {
  employee: Employee;
  handleCancel: () => void;
  handleSave: (updatedEmployee: Employee) => void;
}

export const EditableEmploymentSection: React.FC<EditableEmploymentSectionProps> = ({
  employee,
  handleCancel,
  handleSave
}) => {
  const [formData, setFormData] = useState({
    ...employee,
  });
  
  const [joinDate, setJoinDate] = useState<Date | undefined>(
    employee.joinDate ? new Date(employee.joinDate) : undefined
  );
  
  const [signDate, setSignDate] = useState<Date | undefined>(
    employee.signDate ? new Date(employee.signDate) : undefined
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedEmployee = {
      ...employee,
      employeeId: formData.employeeId,
      barcode: formData.barcode,
      organization: formData.organization,
      jobPosition: formData.jobPosition,
      jobLevel: formData.jobLevel,
      employmentStatus: formData.employmentStatus,
      branch: formData.branch,
      joinDate: joinDate ? format(joinDate, 'dd MMM yyyy') : employee.joinDate,
      signDate: signDate ? format(signDate, 'dd MMM yyyy') : employee.signDate,
    };
    
    handleSave(updatedEmployee);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Employment</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Employment data</h3>
          <p className="text-sm text-gray-500 mb-4">Your data information related to company.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <Label htmlFor="companyName">Company name</Label>
                <Input 
                  id="companyName" 
                  name="companyName"
                  value="PT CHEMISTRY BEAUTY INDONESIA"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId" 
                  name="employeeId" 
                  value={formData.employeeId || ''} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input 
                  id="barcode" 
                  name="barcode" 
                  value={formData.barcode || ''} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="organization">Organization name</Label>
                <Input 
                  id="organization" 
                  name="organization" 
                  value={formData.organization || ''} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="jobPosition">Job position</Label>
                <Input 
                  id="jobPosition" 
                  name="jobPosition" 
                  value={formData.jobPosition || ''} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="jobLevel">Job level</Label>
                <Input 
                  id="jobLevel" 
                  name="jobLevel" 
                  value={formData.jobLevel || ''} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="employmentStatus">Employment status</Label>
                <Select 
                  defaultValue={formData.employmentStatus || 'Permanent'}
                  onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input 
                  id="branch" 
                  name="branch" 
                  value={formData.branch || 'Pusat'} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="joinDate">Join date</Label>
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
              <div>
                <Label htmlFor="signDate">Sign date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {signDate ? (
                        format(signDate, "PPP")
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
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </div>
      </div>
    </Card>
  );
};
