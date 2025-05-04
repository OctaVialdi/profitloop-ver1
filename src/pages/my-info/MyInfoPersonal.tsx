
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { Edit, CalendarIcon, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/auth";
import {
  updateEmployeePersonalDetails,
  updateEmployee,
  EmployeePersonalDetails
} from "@/services/employeeService";

export default function MyInfoPersonal() {
  const { user } = useAuthState();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  
  // Form state
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobilePhone: "",
    birthPlace: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    bloodType: ""
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      fetchEmployeeData();
    }
  }, [user?.id]);

  const fetchEmployeeData = async () => {
    setIsLoading(true);
    try {
      // Get employee data for current user
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("*, employee_personal_details(*)")
        .eq("organization_id", user?.organization_id)
        .eq("email", user?.email)
        .single();

      if (employeeError) throw employeeError;

      if (employeeData) {
        setEmployee(employeeData);
        
        // Set form values
        setFormValues({
          name: employeeData.name || "",
          email: employeeData.email || "",
          mobilePhone: employeeData.employee_personal_details?.mobile_phone || "",
          birthPlace: employeeData.employee_personal_details?.birth_place || "",
          gender: employeeData.employee_personal_details?.gender || "",
          maritalStatus: employeeData.employee_personal_details?.marital_status || "",
          religion: employeeData.employee_personal_details?.religion || "",
          bloodType: employeeData.employee_personal_details?.blood_type || ""
        });

        // Set birth date if exists
        if (employeeData.employee_personal_details?.birth_date) {
          const date = new Date(employeeData.employee_personal_details.birth_date);
          if (isValid(date)) {
            setBirthDate(date);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch your data");
    } finally {
      setIsLoading(false);
    }
  };

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
        name: employee?.name || "",
        email: employee?.email || "",
        mobilePhone: employee?.employee_personal_details?.mobile_phone || "",
        birthPlace: employee?.employee_personal_details?.birth_place || "",
        gender: employee?.employee_personal_details?.gender || "",
        maritalStatus: employee?.employee_personal_details?.marital_status || "",
        religion: employee?.employee_personal_details?.religion || "",
        bloodType: employee?.employee_personal_details?.blood_type || ""
      });
      
      if (employee?.employee_personal_details?.birth_date) {
        const date = new Date(employee.employee_personal_details.birth_date);
        setBirthDate(isValid(date) ? date : undefined);
      } else {
        setBirthDate(undefined);
      }
    }
    setIsEditing(!isEditing);
  };
  
  const handleSave = async () => {
    if (!employee) return;
    
    setIsLoading(true);
    
    try {
      // First update the base employee data (name and email)
      await updateEmployee({
        id: employee.id,
        name: formValues.name,
        email: formValues.email
      });
      
      // Then update the personal details
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
      setIsEditing(false); // Exit edit mode after successful save
      
      // Refresh data
      fetchEmployeeData();
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !employee) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Personal Data</h2>
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
                      <p className="font-medium">{employee?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{employee?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile phone</p>
                      <p className="font-medium">{employee?.employee_personal_details?.mobile_phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Place of birth</p>
                      <p className="font-medium">{employee?.employee_personal_details?.birth_place || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Birthdate</p>
                      <p className="font-medium">
                        {employee?.employee_personal_details?.birth_date ? 
                          format(new Date(employee.employee_personal_details.birth_date), "PPP") : 
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{employee?.employee_personal_details?.gender || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Marital status</p>
                      <p className="font-medium">{employee?.employee_personal_details?.marital_status || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood type</p>
                      <p className="font-medium">{employee?.employee_personal_details?.blood_type || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Religion</p>
                      <p className="font-medium">{employee?.employee_personal_details?.religion || "-"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
