
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EmptyDataDisplay } from "./PersonalSection";

interface EditablePersonalSectionProps {
  employee: Employee;
  handleCancel: () => void;
  handleSave: (updatedEmployee: Employee) => void;
}

export const EditablePersonalSection: React.FC<EditablePersonalSectionProps> = ({
  employee,
  handleCancel,
  handleSave
}) => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState({
    ...employee,
    firstName: employee.name?.split(' ')[0] || '',
    lastName: employee.name?.split(' ').slice(1).join(' ') || '',
  });
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    employee.birthDate ? new Date(employee.birthDate) : undefined
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const updatedEmployee = {
      ...employee,
      name: fullName,
      mobilePhone: formData.mobilePhone,
      email: formData.email,
      birthPlace: formData.birthPlace,
      birthDate: birthdate ? format(birthdate, 'dd MMM yyyy') : employee.birthDate,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      address: formData.address,
    };
    
    handleSave(updatedEmployee);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal</h2>
        </div>

        <Tabs defaultValue="basic-info" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
            <TabsTrigger
              value="basic-info"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            >
              Basic info
            </TabsTrigger>
            <TabsTrigger
              value="family"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            >
              Family
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            >
              Emergency contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Personal data</h3>
                <p className="text-sm text-gray-500 mb-4">Your email address is your identity on Talenta is used to log in.</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <Label htmlFor="firstName">First name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobilePhone">Mobile phone</Label>
                      <Input 
                        id="mobilePhone" 
                        name="mobilePhone" 
                        value={formData.mobilePhone || ''} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.mobilePhone || ''} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthPlace">Place of birth</Label>
                      <Input 
                        id="birthPlace" 
                        name="birthPlace" 
                        value={formData.birthPlace || ''} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthdate">Birthdate <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {birthdate ? (
                              format(birthdate, "PPP")
                            ) : (
                              <span className="text-gray-400">Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthdate}
                            onSelect={setBirthdate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <RadioGroup 
                        defaultValue={formData.gender || "Male"} 
                        className="flex gap-4 pt-2"
                        onValueChange={(value) => handleSelectChange("gender", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital status <span className="text-red-500">*</span></Label>
                      <Select 
                        defaultValue={formData.maritalStatus || ''}
                        onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bloodType">Blood type</Label>
                      <Select 
                        defaultValue="O"
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="religion">Religion <span className="text-red-500">*</span></Label>
                      <Select 
                        defaultValue={formData.religion || ''}
                        onValueChange={(value) => handleSelectChange("religion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
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
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Identity & Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <Label htmlFor="nik">NIK (NPWP 16 digit)</Label>
                      <Input 
                        id="nik" 
                        name="nik"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="passport">Passport number</Label>
                      <Input 
                        id="passport" 
                        name="passport"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="passportExpiry">Passport expiration date</Label>
                      <Input 
                        id="passportExpiry" 
                        name="passportExpiry"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal code</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode"
                        defaultValue=""
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="citizenAddress">Citizen ID address</Label>
                      <Input 
                        id="citizenAddress" 
                        name="citizenAddress"
                        defaultValue=""
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Residential address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={formData.address || ''} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSubmit}>Save changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="family" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your family information data will be displayed here."
              section="family"
              handleEdit={() => {}}
            />
          </TabsContent>

          <TabsContent value="emergency" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your emergency contact data will be displayed here."
              section="emergency"
              handleEdit={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
