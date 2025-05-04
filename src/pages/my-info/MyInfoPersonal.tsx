
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Check, X, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UserPersonalDetails {
  id: string;
  full_name?: string | null;
  email?: string | null;
  mobile_phone?: string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  religion?: string | null;
  blood_type?: string | null;
}

const MyInfoPersonal: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState<UserPersonalDetails | null>(null);
  
  // Form state
  const [formValues, setFormValues] = useState({
    full_name: "",
    email: "",
    mobile_phone: "",
    birth_place: "",
    gender: "",
    marital_status: "",
    religion: "",
    blood_type: ""
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      // First get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Check if personal details exist in employee_personal_details
      let personalDetails = null;
      
      // Check if user is linked to an employee
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id, name, email')
        .eq('user_id', user?.id)
        .single();
      
      if (!employeeError && employeeData) {
        // User is an employee, get their personal details
        const { data: employeePersonalData, error: employeePersonalError } = await supabase
          .from('employee_personal_details')
          .select('*')
          .eq('employee_id', employeeData.id)
          .single();
          
        if (!employeePersonalError) {
          personalDetails = employeePersonalData;
        }
      }
      
      // Combine all data
      const userData: UserPersonalDetails = {
        id: user!.id,
        full_name: profileData?.full_name || user?.user_metadata?.full_name,
        email: user?.email,
        mobile_phone: personalDetails?.mobile_phone || null,
        birth_place: personalDetails?.birth_place || null,
        birth_date: personalDetails?.birth_date || null,
        gender: personalDetails?.gender || null,
        marital_status: personalDetails?.marital_status || null,
        religion: personalDetails?.religion || null,
        blood_type: personalDetails?.blood_type || null,
      };
      
      setUserDetails(userData);
      
      // Setup form values
      setFormValues({
        full_name: userData.full_name || "",
        email: userData.email || "",
        mobile_phone: userData.mobile_phone || "",
        birth_place: userData.birth_place || "",
        gender: userData.gender || "",
        marital_status: userData.marital_status || "",
        religion: userData.religion || "",
        blood_type: userData.blood_type || ""
      });
      
      // Set birth date if available
      if (userData.birth_date) {
        setBirthDate(new Date(userData.birth_date));
      }
      
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load your personal details");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form values when canceling edit
      if (userDetails) {
        setFormValues({
          full_name: userDetails.full_name || "",
          email: userDetails.email || "",
          mobile_phone: userDetails.mobile_phone || "",
          birth_place: userDetails.birth_place || "",
          gender: userDetails.gender || "",
          marital_status: userDetails.marital_status || "",
          religion: userDetails.religion || "",
          blood_type: userDetails.blood_type || ""
        });
        
        setBirthDate(userDetails.birth_date ? new Date(userDetails.birth_date) : undefined);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update the profile table for full_name and email
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formValues.full_name,
          email: formValues.email,
        })
        .eq('id', user?.id);
        
      if (profileError) throw profileError;
      
      // Check if user is linked to an employee
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user?.id)
        .single();
        
      if (!employeeError && employeeData) {
        // Update employee table for name and email
        const { error: employeeUpdateError } = await supabase
          .from('employees')
          .update({
            name: formValues.full_name,
            email: formValues.email,
          })
          .eq('id', employeeData.id);
          
        if (employeeUpdateError) throw employeeUpdateError;
        
        // Update employee personal details
        const { data: existingDetails, error: existingError } = await supabase
          .from('employee_personal_details')
          .select('id')
          .eq('employee_id', employeeData.id)
          .single();
          
        const personalDetails = {
          mobile_phone: formValues.mobile_phone,
          birth_place: formValues.birth_place,
          birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
          gender: formValues.gender,
          marital_status: formValues.marital_status,
          religion: formValues.religion,
          blood_type: formValues.blood_type
        };
          
        if (existingError && existingError.code === 'PGRST116') {
          // No existing record, insert a new one
          const { error: insertError } = await supabase
            .from('employee_personal_details')
            .insert([{
              employee_id: employeeData.id,
              ...personalDetails
            }]);
            
          if (insertError) throw insertError;
        } else if (!existingError) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('employee_personal_details')
            .update(personalDetails)
            .eq('employee_id', employeeData.id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Refresh user details
      await fetchUserDetails();
      
      toast.success("Personal details updated successfully");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-8">Personal Information</h1>
      
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Personal Data</h2>
          </div>
          
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
                  <Edit size={14} /> Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="p-4 space-y-5">
                {/* Editing Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                      id="full_name"
                      value={formValues.full_name}
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
                    <Label htmlFor="mobile_phone">Mobile phone</Label>
                    <Input
                      id="mobile_phone"
                      value={formValues.mobile_phone}
                      onChange={handleInputChange}
                      placeholder="Enter mobile phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birth_place">Place of birth</Label>
                    <Input
                      id="birth_place"
                      value={formValues.birth_place}
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
                      value={formValues.gender || ""}
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
                      value={formValues.marital_status || ""}
                      onValueChange={(value) => handleSelectChange("marital_status", value)}
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
                      value={formValues.religion || ""}
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
                      value={formValues.blood_type || ""}
                      onValueChange={(value) => handleSelectChange("blood_type", value)}
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
                    <p className="font-medium">{userDetails?.full_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userDetails?.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile phone</p>
                    <p className="font-medium">{userDetails?.mobile_phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Place of birth</p>
                    <p className="font-medium">{userDetails?.birth_place || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthdate</p>
                    <p className="font-medium">
                      {userDetails?.birth_date 
                        ? format(new Date(userDetails.birth_date), "PPP")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{userDetails?.gender ? 
                      userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital status</p>
                    <p className="font-medium">{userDetails?.marital_status ? 
                      userDetails.marital_status.charAt(0).toUpperCase() + userDetails.marital_status.slice(1) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood type</p>
                    <p className="font-medium">{userDetails?.blood_type || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Religion</p>
                    <p className="font-medium">{userDetails?.religion ? 
                      userDetails.religion.charAt(0).toUpperCase() + userDetails.religion.slice(1) : "-"}</p>
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
