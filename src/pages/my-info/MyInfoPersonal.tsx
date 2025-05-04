
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const MyInfoPersonal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<any>(null);

  const [formValues, setFormValues] = useState({
    mobilePhone: "",
    birthPlace: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    bloodType: ""
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setIsLoading(true);
      try {
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("User not authenticated");
          return;
        }
        
        // Find the employee record matching the user's email
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (employeeError || !employeeData) {
          console.error("Error fetching employee data:", employeeError);
          toast.error("Failed to fetch your information");
          return;
        }
        
        // Set employee data
        setEmployee(employeeData);
        
        // Set form values from employee data
        setFormValues({
          mobilePhone: employeeData.mobile_phone || "",
          birthPlace: employeeData.birth_place || "",
          gender: employeeData.gender || "",
          maritalStatus: employeeData.marital_status || "",
          religion: employeeData.religion || "",
          bloodType: employeeData.blood_type || ""
        });
        
        // Set birth date if it exists
        if (employeeData.birth_date) {
          setBirthDate(new Date(employeeData.birth_date));
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form values to original employee data
      setFormValues({
        mobilePhone: employee?.mobile_phone || "",
        birthPlace: employee?.birth_place || "",
        gender: employee?.gender || "",
        maritalStatus: employee?.marital_status || "",
        religion: employee?.religion || "",
        bloodType: employee?.blood_type || "",
      });
      
      // Reset birth date
      if (employee?.birth_date) {
        setBirthDate(new Date(employee.birth_date));
      } else {
        setBirthDate(undefined);
      }
    }
    
    setIsEditing(!isEditing);
  };
  
  const handleSave = async () => {
    if (!employee) return;
    
    setIsSaving(true);
    
    try {
      // Update employee data
      const { error } = await supabase
        .from("employees")
        .update({
          mobile_phone: formValues.mobilePhone,
          birth_place: formValues.birthPlace,
          birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
          gender: formValues.gender,
          marital_status: formValues.maritalStatus,
          religion: formValues.religion,
          blood_type: formValues.bloodType
        })
        .eq("id", employee.id);
      
      if (error) {
        console.error("Failed to update personal details:", error);
        toast.error("Failed to update personal details");
        return;
      }
      
      // Update the local employee state with new values
      setEmployee({
        ...employee,
        mobile_phone: formValues.mobilePhone,
        birth_place: formValues.birthPlace,
        birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
        gender: formValues.gender,
        marital_status: formValues.maritalStatus,
        religion: formValues.religion,
        blood_type: formValues.bloodType
      });
      
      toast.success("Personal details updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">No employee data found for your account</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personal Information</h1>
      </div>

      <Card>
        <div className="p-6">
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
                    disabled={isSaving}
                  >
                    <X size={14} /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="gap-1 flex items-center"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
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
                  Edit
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
                    <p className="font-medium">{employee.mobile_phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Place of birth</p>
                    <p className="font-medium">{employee.birth_place || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthdate</p>
                    <p className="font-medium">{employee.birth_date ? format(new Date(employee.birth_date), "PPP") : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{employee.gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital status</p>
                    <p className="font-medium">{employee.marital_status || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood type</p>
                    <p className="font-medium">{employee.blood_type || "-"}</p>
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
      </Card>
    </div>
  );
};

export default MyInfoPersonal;
