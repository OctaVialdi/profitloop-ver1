
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Edit, CalendarIcon, Loader2, Check, X } from "lucide-react";
import { LegacyEmployee, EmployeePersonalDetails } from "@/hooks/useEmployees";
import { updateEmployeePersonalDetails } from "@/services/employeeService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PersonalSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  employee,
  handleEdit
}) => {
  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formValues, setFormValues] = useState({
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form values
      setFormValues({
        mobilePhone: employee.mobilePhone || "",
        birthPlace: employee.birthPlace || "",
        gender: employee.gender || "",
        maritalStatus: employee.maritalStatus || "",
        religion: employee.religion || "",
        bloodType: employee.bloodType || ""
      });
      setBirthDate(employee.birthDate ? new Date(employee.birthDate) : undefined);
    }
    setIsEditing(!isEditing);
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
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
      setIsEditing(false);
      // Refresh data
      handleEdit("refresh");
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal Data</h2>
        </div>
        
        <div>
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <div></div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 flex items-center"
                    onClick={toggleEditMode}
                    disabled={isLoading}
                  >
                    <X size={14} /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="gap-1 flex items-center"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Save
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 flex items-center"
                  onClick={toggleEditMode}
                >
                  <Edit size={14} /> Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="p-4 space-y-5">
                {/* Editing Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                  <div className="space-y-2">
                    <Label>Birth date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
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
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile phone</p>
                    <p className="font-medium">{employee.mobilePhone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Place of birth</p>
                    <p className="font-medium">{employee.birthPlace || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthdate</p>
                    <p className="font-medium">{employee.birthDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{employee.gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital status</p>
                    <p className="font-medium">{employee.maritalStatus || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood type</p>
                    <p className="font-medium">{employee.bloodType || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Religion</p>
                    <p className="font-medium">{employee.religion || "-"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
