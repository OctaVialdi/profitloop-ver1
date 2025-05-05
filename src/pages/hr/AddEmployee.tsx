
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { employeeService } from "@/services/employeeService";

export default function AddEmployee() {
  const navigate = useNavigate();
  const { userProfile } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for personal info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    birthPlace: "",
    gender: "male",
    maritalStatus: "single",
    bloodType: "",
    religion: "islam"
  });
  
  // State for dates with date picker
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(undefined);
  
  // Form state for identity & address
  const [identityAddress, setIdentityAddress] = useState({
    nik: "",
    passportNumber: "",
    postalCode: "",
    citizenAddress: "",
    residentialAddress: ""
  });
  
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);
  
  // Handle personal info input changes
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle identity & address input changes
  const handleIdentityAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setIdentityAddress(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle checkbox for using citizen address as residential address
  const handleUseResidentialAddress = (checked: boolean) => {
    setUseResidentialAddress(checked);
    if (checked && identityAddress.citizenAddress) {
      setIdentityAddress(prev => ({ ...prev, residentialAddress: identityAddress.citizenAddress }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!userProfile?.organization_id) {
      toast.error("No organization found. Please refresh the page or contact support.");
      return;
    }
    
    if (!personalInfo.firstName.trim()) {
      toast.error("Employee first name is required");
      return;
    }
    
    if (!personalInfo.email.trim()) {
      toast.error("Employee email is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the name
      const fullName = [personalInfo.firstName, personalInfo.lastName]
        .filter(Boolean)
        .join(" ");
      
      // Prepare employee data
      const employeeData = {
        name: fullName,
        email: personalInfo.email,
        status: "Active",
        organization_id: userProfile.organization_id,
        mobile_phone: personalInfo.mobilePhone || null,
        birth_place: personalInfo.birthPlace || null,
        birth_date: birthdate ? format(birthdate, 'yyyy-MM-dd') : null,
        gender: personalInfo.gender || null,
        marital_status: personalInfo.maritalStatus || null,
        religion: personalInfo.religion || null,
        blood_type: personalInfo.bloodType || null,
        nik: identityAddress.nik || null,
        passport_number: identityAddress.passportNumber || null,
        passport_expiry: passportExpiry ? format(passportExpiry, 'yyyy-MM-dd') : null,
        postal_code: identityAddress.postalCode || null,
        citizen_address: identityAddress.citizenAddress || null,
        address: identityAddress.residentialAddress || null
      };
      
      console.log("Creating employee with data:", employeeData);
      
      // Create employee using the service method
      const result = await employeeService.createEmployee(employeeData);
      
      if (!result) {
        toast.error("Failed to create employee");
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Link to="/hr/data" className="flex items-center hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to employee list
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      
      {/* Personal Data Card */}
      <Card className="shadow-sm">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Personal Data</h2>
            <p className="text-sm text-gray-500 mt-1">Fill all employee personal basic information data</p>
          </div>
          
          <div className="border rounded-md">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-medium">Basic Information</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter first name"
                    required
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter last name"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    id="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter email"
                    type="email"
                    required
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile phone</Label>
                  <Input
                    id="mobilePhone"
                    value={personalInfo.mobilePhone}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter mobile phone"
                    className="h-10"
                  />
                </div>
              </div>
              
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Place of birth</Label>
                  <Input
                    id="birthPlace"
                    value={personalInfo.birthPlace}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter birth place"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Birth date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left h-10",
                          !birthdate && "text-muted-foreground"
                        )}
                      >
                        {birthdate ? format(birthdate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={birthdate}
                        onSelect={setBirthdate}
                        initialFocus
                        disabled={(date) => date > new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={personalInfo.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger className="h-10">
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
                    value={personalInfo.maritalStatus}
                    onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                  >
                    <SelectTrigger className="h-10">
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
                    value={personalInfo.religion}
                    onValueChange={(value) => handleSelectChange("religion", value)}
                  >
                    <SelectTrigger className="h-10">
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
                    value={personalInfo.bloodType}
                    onValueChange={(value) => handleSelectChange("bloodType", value)}
                  >
                    <SelectTrigger className="h-10">
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
          </div>
        </div>
      </Card>
      
      {/* Identity & Address Card */}
      <Card className="shadow-sm">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Identity & Address</h2>
            <p className="text-sm text-gray-500 mt-1">Information related to identity documents and addresses</p>
          </div>
          
          <div className="border rounded-md">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-medium">Identity Documents</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (16 digit)</Label>
                  <Input
                    id="nik"
                    value={identityAddress.nik}
                    onChange={handleIdentityAddressChange}
                    placeholder="Enter NIK"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport number</Label>
                  <Input
                    id="passportNumber"
                    value={identityAddress.passportNumber}
                    onChange={handleIdentityAddressChange}
                    placeholder="Enter passport number"
                    className="h-10"
                  />
                </div>
              
                <div className="space-y-2">
                  <Label>Passport expiry date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left h-10",
                          !passportExpiry && "text-muted-foreground"
                        )}
                      >
                        {passportExpiry ? format(passportExpiry, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={passportExpiry}
                        onSelect={setPassportExpiry}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input
                    id="postalCode"
                    value={identityAddress.postalCode}
                    onChange={handleIdentityAddressChange}
                    placeholder="Enter postal code"
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citizenAddress">Citizen ID address</Label>
                <Input
                  id="citizenAddress"
                  value={identityAddress.citizenAddress}
                  onChange={handleIdentityAddressChange}
                  placeholder="Enter citizen ID address"
                  className="h-10"
                />
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="useResidentialAddress" 
                  checked={useResidentialAddress} 
                  onCheckedChange={handleUseResidentialAddress}
                />
                <Label htmlFor="useResidentialAddress" className="font-normal cursor-pointer">
                  Use citizen ID address as residential address
                </Label>
              </div>
              
              {!useResidentialAddress && (
                <div className="space-y-2">
                  <Label htmlFor="residentialAddress">Residential address</Label>
                  <Input
                    id="residentialAddress"
                    value={identityAddress.residentialAddress}
                    onChange={handleIdentityAddressChange}
                    placeholder="Enter residential address"
                    className="h-10"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Form action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              className="px-6"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              className="px-6 bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
