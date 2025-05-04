import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEmployees, convertFromLegacyFormat } from "@/hooks/useEmployees";

const EmployeePersonal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useEmployees();

  // Find the employee with the matching ID
  const employee = employees.find(emp => emp.id === id);

  // Setup form with default values from employee data
  const form = useForm({
    defaultValues: {
      firstName: employee?.name?.split(' ')[0] || '',
      lastName: employee?.name?.split(' ').slice(1).join(' ') || '',
      email: employee?.email || '',
      mobilePhone: employee?.personalDetails?.mobile_phone || '',
      phone: employee?.personalDetails?.mobile_phone || '',
      birthPlace: employee?.personalDetails?.birth_place || '',
      birthDate: employee?.personalDetails?.birth_date || '',
      gender: employee?.personalDetails?.gender || '',
      maritalStatus: employee?.personalDetails?.marital_status || '',
      bloodType: employee?.personalDetails?.blood_type || '',
      religion: employee?.personalDetails?.religion || '',
      nik: employee?.identityAddress?.nik || '',
      passportNumber: employee?.identityAddress?.passport_number || '',
      passportExpiry: employee?.identityAddress?.passport_expiry || '',
      postalCode: employee?.identityAddress?.postal_code || '',
      citizenAddress: employee?.identityAddress?.citizen_address || '',
      residentialAddress: employee?.identityAddress?.residential_address || '',
      useResidentialAddress: false
    }
  });

  // Handle save changes
  const onSubmit = (data: any) => {
    // Update employee data
    if (employee && id) {
      updateEmployee({
        id: id,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        personalDetails: {
          employee_id: id,
          mobile_phone: data.mobilePhone,
          birth_place: data.birthPlace,
          birth_date: data.birthDate,
          gender: data.gender,
          marital_status: data.maritalStatus,
          blood_type: data.bloodType,
          religion: data.religion
        },
        identityAddress: {
          employee_id: id,
          nik: data.nik,
          passport_number: data.passportNumber,
          passport_expiry: data.passportExpiry,
          postal_code: data.postalCode,
          citizen_address: data.citizenAddress,
          residential_address: data.residentialAddress
        }
      });
      
      toast.success("Personal data updated successfully");
      navigate(`/hr/data/employee/${id}`);
    }
  };

  const handleCancel = () => {
    navigate(`/hr/data/employee/${id}`);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate(`/hr/data/employee/${id}`)}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee Details</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Personal</h1>
      
      <Tabs defaultValue="basic-info">
        <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
          <TabsTrigger 
            value="basic-info" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            onClick={() => setActiveTab("basic-info")}
          >
            Basic info
          </TabsTrigger>
          <TabsTrigger 
            value="family" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            onClick={() => setActiveTab("family")}
          >
            Family
          </TabsTrigger>
          <TabsTrigger 
            value="emergency" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            onClick={() => setActiveTab("emergency")}
          >
            Emergency contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="pt-6">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal data</h3>
                  <p className="text-sm text-gray-500 mb-4">Your email address is your identity and is used to log in.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
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
                          <FormLabel>Birthdate *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} />
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
                          <FormLabel>Marital status *</FormLabel>
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
                          <FormLabel>Religion *</FormLabel>
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
                          <FormLabel>NIK (NPWP 16 digit)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                              <Input {...field} />
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
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="pt-6">
          <Card className="p-6 text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4">
              <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium">There is no data to display</h3>
            <p className="text-gray-500 mt-2">Your family information data will be displayed here.</p>
            
            <div className="mt-6 flex justify-center gap-3">
              <Button size="sm">Add new</Button>
              <Button size="sm" variant="outline">Import</Button>
              <Button size="sm" variant="outline">Export</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="pt-6">
          <Card className="p-6 text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4">
              <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium">There is no data to display</h3>
            <p className="text-gray-500 mt-2">Your emergency contact data will be displayed here.</p>
            
            <div className="mt-6 flex justify-center gap-3">
              <Button size="sm">Add new</Button>
              <Button size="sm" variant="outline">Import</Button>
              <Button size="sm" variant="outline">Export</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeePersonal;
