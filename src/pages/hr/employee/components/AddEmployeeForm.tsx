
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useOrganization } from "@/hooks/useOrganization";
import { useEmployees } from "@/hooks/useEmployees";

// Helper to format NIK input with dashes
const formatNik = (value: string) => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Add dashes after every 4 digits
  let formattedValue = '';
  for (let i = 0; i < digitsOnly.length && i < 20; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += '-';
    }
    formattedValue += digitsOnly[i];
  }
  
  return formattedValue;
};

const AddEmployeeForm = () => {
  const navigate = useNavigate();
  const { userProfile } = useOrganization();
  const { employees, addEmployee } = useEmployees();
  
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState('');
  
  // Setup form with default values
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobilePhone: '',
      birthPlace: '',
      birthDate: '',
      gender: 'Male',
      maritalStatus: 'Single',
      bloodType: '',
      religion: 'Islam',
      nik: '',
      passportNumber: '',
      passportExpiry: '',
      postalCode: '',
      citizenAddress: '',
      residentialAddress: '',
      employeeId: '',
      barcode: '',
      organization: '',
      jobPosition: '',
      jobLevel: '',
      employmentStatus: 'Permanent',
      branch: 'Pusat',
      joinDate: new Date().toISOString().split('T')[0],
      signDate: new Date().toISOString().split('T')[0]
    }
  });

  // Auto-generate employee ID on component mount
  useEffect(() => {
    generateEmployeeId();
  }, [employees]);

  // Function to generate a unique employee ID
  const generateEmployeeId = () => {
    const prefix = "EMP";
    const existingIds = employees
      .map(emp => emp.employee_id || '')
      .filter(id => id.startsWith(prefix))
      .map(id => {
        const numPart = id.replace(prefix, '');
        return isNaN(parseInt(numPart)) ? 0 : parseInt(numPart);
      });
    
    const maxId = Math.max(0, ...existingIds);
    const newId = `${prefix}${String(maxId + 1).padStart(4, '0')}`;
    setGeneratedEmployeeId(newId);
    form.setValue('employeeId', newId);
  };

  // Handle NIK input formatting
  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNik(e.target.value);
    form.setValue('nik', formattedValue);
  };

  // Handle save changes
  const onSubmit = async (data: any) => {
    if (!userProfile?.organization_id) {
      toast.error("No organization found. Please refresh the page or contact support.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting employee data:", data);
      
      // Format the name from firstName and lastName
      const fullName = [data.firstName, data.lastName]
        .filter(Boolean)
        .join(" ");
        
      if (!fullName) {
        toast.error("Employee name is required");
        setIsSubmitting(false);
        return;
      }

      // Prepare employee data with explicit organization_id
      const employeeData = {
        name: fullName,
        email: data.email,
        employee_id: data.employeeId,
        status: "Active",
        organization_id: userProfile.organization_id
      };

      // Prepare personal details data
      const personalDetails = {
        mobile_phone: data.mobilePhone,
        birth_place: data.birthPlace,
        birth_date: data.birthDate || undefined,
        gender: data.gender,
        marital_status: data.maritalStatus,
        religion: data.religion,
        blood_type: data.bloodType
      };

      // Prepare identity address data - remove dashes from NIK for storage
      const identityAddress = {
        nik: data.nik ? data.nik.replace(/-/g, '') : '',
        passport_number: data.passportNumber,
        passport_expiry: data.passportExpiry || undefined,
        postal_code: data.postalCode,
        citizen_address: data.citizenAddress,
        residential_address: data.residentialAddress
      };

      // Prepare employment data
      const employment = {
        barcode: data.barcode,
        organization: data.organization,
        job_position: data.jobPosition,
        job_level: data.jobLevel,
        employment_status: data.employmentStatus,
        branch: data.branch,
        join_date: data.joinDate || undefined,
        sign_date: data.signDate || undefined
      };

      console.log("Creating employee with data:", { 
        employeeData, 
        personalDetails, 
        identityAddress, 
        employment,
        organization_id: userProfile.organization_id
      });
      
      // Create employee using the hook method
      const result = await addEmployee(
        employeeData,
        personalDetails,
        identityAddress,
        employment
      );
      
      if (!result) {
        toast.error("Failed to create employee");
        console.error("Employee creation returned null result");
        return;
      }
      
      console.log("Employee created successfully with ID:", result.id);
      toast.success("Employee created successfully");
      
      // Navigate back to employee list
      navigate(`/hr/data`);
      
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/hr/data`);
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
          <TabsTrigger 
            value="basic-info" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
          >
            Basic info
          </TabsTrigger>
          <TabsTrigger 
            value="employment" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
          >
            Employment
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="employeeForm" className="space-y-6">
            <TabsContent value="basic-info" className="pt-6">
              {/* Added fixed height with vertical scrolling */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal data</h3>
                  <p className="text-sm text-gray-500 mb-4">Employee personal information and contact details.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name *</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID *</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input {...field} required readOnly className="bg-gray-50" />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                onClick={generateEmployeeId}
                                title="Generate new ID"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mobilePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of birth</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthdate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="date" />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Male" id="male" />
                                <label htmlFor="male">Male</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Female" id="female" />
                                <label htmlFor="female">Female</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religion</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select religion" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Islam">Islam</SelectItem>
                              <SelectItem value="Christianity">Christianity</SelectItem>
                              <SelectItem value="Catholicism">Catholicism</SelectItem>
                              <SelectItem value="Hinduism">Hinduism</SelectItem>
                              <SelectItem value="Buddhism">Buddhism</SelectItem>
                              <SelectItem value="Confucianism">Confucianism</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Identity & Address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nik"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIK (16 digit)</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value} 
                              onChange={(e) => handleNikChange(e)}
                              placeholder="1234-5678-9012-3456"
                              maxLength={19} // 16 digits plus 3 dashes
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passportNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passportExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport expiration date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="date" />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="citizenAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Citizen ID address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="residentialAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Residential address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="pt-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <h3 className="text-lg font-medium mb-3">Employment details</h3>
                  <p className="text-sm text-gray-500 mb-4">Job position and organizational information.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jobPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Position</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jobLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Level</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Permanent">Permanent</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Probation">Probation</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="joinDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Join Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="date" />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="signDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sign Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="date" />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Save button moved outside of tab content, visible for both tabs */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
};

export default AddEmployeeForm;
