
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
import { LegacyEmployee, EmployeePersonalDetails } from "@/hooks/useEmployees";
import { updateEmployeePersonalDetails, updateEmployeeBasicInfo } from "@/services/employeeService";

interface EditPersonalDetailsDialogProps {
  open: boolean;
  employee: LegacyEmployee;
  onClose: () => void;
  onSave: () => void;
}

export const EditPersonalDetailsDialog = ({
  open,
  employee,
  onClose,
  onSave
}: EditPersonalDetailsDialogProps) => {
  const [formValues, setFormValues] = useState({
    name: employee.name || "",
    email: employee.email || "",
    mobilePhone: employee.mobilePhone || "",
    birthPlace: employee.birthPlace || "",
    gender: employee.gender || "",
    maritalStatus: employee.maritalStatus || "",
    religion: employee.religion || "",
    bloodType: employee.bloodType || ""
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(
    employee.birthDate ? new Date(employee.birthDate) : undefined
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
      // First update basic info (name, email)
      await updateEmployeeBasicInfo(employee.id, {
        name: formValues.name,
        email: formValues.email
      });
      
      // Then update personal details
      const updatedData: Partial<EmployeePersonalDetails> = {
        mobile_phone: formValues.mobilePhone,
        birth_place: formValues.birthPlace,
        birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
        gender: formValues.gender,
        marital_status: formValues.maritalStatus,
        religion: formValues.religion,
        blood_type: formValues.bloodType
      };
      
      await updateEmployeePersonalDetails(employee.id, updatedData);
      
      toast.success("Personal details updated successfully");
      onSave();
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Personal Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Name and Email fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobilePhone">Mobile phone</Label>
              <Input
                id="mobilePhone"
                value={formValues.mobilePhone}
                onChange={handleInputChange}
                placeholder="Enter mobile phone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Place of birth</Label>
              <Input
                id="birthPlace"
                value={formValues.birthPlace}
                onChange={handleInputChange}
                placeholder="Enter birth place"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Birth date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formValues.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marital status</Label>
              <Select
                value={formValues.maritalStatus}
                onValueChange={(value) => handleSelectChange("maritalStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select
                value={formValues.religion}
                onValueChange={(value) => handleSelectChange("religion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="christianity">Christianity</SelectItem>
                  <SelectItem value="catholicism">Catholicism</SelectItem>
                  <SelectItem value="hinduism">Hinduism</SelectItem>
                  <SelectItem value="buddhism">Buddhism</SelectItem>
                  <SelectItem value="confucianism">Confucianism</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Blood type</Label>
            <Select
              value={formValues.bloodType}
              onValueChange={(value) => handleSelectChange("bloodType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="O">O</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
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
