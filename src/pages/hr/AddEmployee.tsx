import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { CalendarIcon, X, Plus, Flag, User, Users, Briefcase, Building, Badge, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";

// Step enum to keep track of the current step
enum FormStep {
  PERSONAL_DATA = 1,
  EMPLOYMENT_DATA = 2,
  PAYROLL = 3,
  INVITE = 4
}

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PERSONAL_DATA);
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(undefined);
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);
  const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());
  const [signDate, setSignDate] = useState<Date | undefined>(new Date());
  
  // State for SBU management
  const [sbuList, setSBUList] = useState<{group: string, name: string}[]>([]);
  
  // State for modal dialogs
  const [newStatusDialogOpen, setNewStatusDialogOpen] = useState(false);
  const [newOrgDialogOpen, setNewOrgDialogOpen] = useState(false);
  const [newPositionDialogOpen, setNewPositionDialogOpen] = useState(false);
  const [newLevelDialogOpen, setNewLevelDialogOpen] = useState(false);
  
  // Form values state
  const [formValues, setFormValues] = useState({
    employeeId: "",
    barcode: "",
    groupStructure: "",
    employmentStatus: "Permanent",
    branch: "Pusat",
    organization: "",
    jobPosition: "",
    jobLevel: "",
    grade: "",
    class: "",
    schedule: "",
    approvalLine: "",
    manager: "",
    statusName: "",
    statusHasEndDate: false,
    orgCode: "",
    orgName: "",
    parentOrg: "",
    positionCode: "",
    positionName: "",
    parentPosition: "",
    levelCode: "",
    levelName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleNextStep = () => {
    if (currentStep < FormStep.INVITE) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > FormStep.PERSONAL_DATA) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddSBU = () => {
    // Add a new SBU placeholder to the list
    setSBUList([...sbuList, { group: "", name: "" }]);
  };

  const handleRemoveSBU = (index: number) => {
    const newList = [...sbuList];
    newList.splice(index, 1);
    setSBUList(newList);
  };

  const handleSaveSBU = (index: number, group: string, name: string) => {
    const newList = [...sbuList];
    newList[index] = { group, name };
    setSBUList(newList);
  };

  const handleCreateNewStatus = () => {
    // Handle creating new employment status
    setNewStatusDialogOpen(false);
    // Here you would typically add the new status to a list of available statuses
  };

  const handleCreateNewOrg = () => {
    // Handle creating new organization
    setNewOrgDialogOpen(false);
    // Here you would typically add the new organization to a list of available organizations
  };
  
  const handleCreateNewPosition = () => {
    // Handle creating new job position
    setNewPositionDialogOpen(false);
    // Here you would typically add the new position to a list of available positions
  };
  
  const handleCreateNewLevel = () => {
    // Handle creating new job level
    setNewLevelDialogOpen(false);
    // Here you would typically add the new level to a list of available levels
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Link to="/hr/data" className="hover:underline">
          Employee list
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">Add employee</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className={`flex flex-col items-center ${currentStep >= FormStep.PERSONAL_DATA ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.PERSONAL_DATA ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            {currentStep > FormStep.PERSONAL_DATA ? "✓" : "1"}
          </div>
          <span className="text-sm mt-1">Personal data</span>
        </div>
        
        <div className="flex-grow h-px bg-gray-200 mx-2"></div>
        
        <div className={`flex flex-col items-center ${currentStep >= FormStep.EMPLOYMENT_DATA ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.EMPLOYMENT_DATA ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            2
          </div>
          <span className="text-sm mt-1">Employment data</span>
        </div>
        
        <div className="flex-grow h-px bg-gray-200 mx-2"></div>
        
        <div className={`flex flex-col items-center ${currentStep >= FormStep.PAYROLL ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.PAYROLL ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            3
          </div>
          <span className="text-sm mt-1">Payroll</span>
        </div>
        
        <div className="flex-grow h-px bg-gray-200 mx-2"></div>
        
        <div className={`flex flex-col items-center ${currentStep >= FormStep.INVITE ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.INVITE ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            4
          </div>
          <span className="text-sm mt-1">Invite employee</span>
        </div>
      </div>
      
      <Card className="p-6">
        {currentStep === FormStep.PERSONAL_DATA && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Personal data</h2>
              <p className="text-sm text-gray-500">Fill all employee personal basic information data</p>
            </div>
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">Name<span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <Input id="firstName" placeholder="First name" />
                <Input id="lastName" placeholder="Last name" />
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
              <Input id="email" type="email" placeholder="example@company.com" />
              <p className="text-xs text-gray-500">This email is use for log in</p>
            </div>
            
            {/* Phone numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobilePhone">Mobile phone</Label>
                <Input id="mobilePhone" placeholder="Mobile phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="0" />
              </div>
            </div>
            
            {/* Birth info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Place of birth</Label>
                <Input id="birthPlace" placeholder="City of birth" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate<span className="text-red-500">*</span></Label>
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
            </div>
            
            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup defaultValue="male" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Marital Status */}
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital status<span className="text-red-500">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Blood type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood type</Label>
                <Select>
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
              <div className="space-y-2">
                <Label htmlFor="religion">Religion<span className="text-red-500">*</span></Label>
                <Select>
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
            
            {/* Identity & Address */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-1">Identity & address</h3>
              <p className="text-sm text-gray-500 mb-4">Employee identity address information</p>
              
              {/* NIK & Passport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (NPWP 16 digit)</Label>
                  <Input id="nik" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport number</Label>
                  <Input id="passportNumber" />
                </div>
              </div>
              
              {/* Passport expiry & Postal code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="passportExpiry">Passport expiry date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {passportExpiry ? (
                          format(passportExpiry, "PPP")
                        ) : (
                          <span className="text-gray-400">Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={passportExpiry}
                        onSelect={setPassportExpiry}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input id="postalCode" placeholder="0" />
                </div>
              </div>
              
              {/* Citizen ID Address */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="citizenAddress">Citizen ID address</Label>
                <Input id="citizenAddress" className="h-24" />
              </div>
              
              {/* Use as residential address checkbox */}
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="useAsResidential" 
                  checked={useResidentialAddress}
                  onCheckedChange={(checked) => setUseResidentialAddress(checked as boolean)}
                />
                <Label 
                  htmlFor="useAsResidential" 
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use as residential address
                </Label>
              </div>
              
              {/* Residential Address */}
              {!useResidentialAddress && (
                <div className="space-y-2">
                  <Label htmlFor="residentialAddress">Residential address</Label>
                  <Input id="residentialAddress" className="h-24" />
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentStep === FormStep.EMPLOYMENT_DATA && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Employment data</h2>
              <p className="text-sm text-gray-500 mb-4">Fill all employee data information related to company</p>
            </div>
            
            {/* Employee ID & Barcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">
                  Employee ID<span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="employeeId"
                  name="employeeId"
                  value={formValues.employeeId}
                  onChange={handleInputChange}
                  placeholder="Employee ID" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
                </div>
                <Input 
                  id="barcode" 
                  name="barcode"
                  value={formValues.barcode}
                  onChange={handleInputChange}
                  placeholder="Barcode" 
                />
              </div>
            </div>
            
            {/* Group Structure & Employment Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="groupStructure">Group structure</Label>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
                </div>
                <Select value={formValues.groupStructure} onValueChange={(value) => handleSelectChange("groupStructure", value)}>
                  <SelectTrigger id="groupStructure" className="w-full">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                    </div>
                    <SelectItem value="group1">Group 1</SelectItem>
                    <SelectItem value="group2">Group 2</SelectItem>
                    <SelectItem value="group3">Group 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">
                  Employment status<span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formValues.employmentStatus} 
                  onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                >
                  <SelectTrigger id="employmentStatus" className="w-full">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="flex w-full items-center gap-2 py-1 text-blue-600"
                        onClick={() => setNewStatusDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add new status
                      </Button>
                    </div>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Join Date & Sign Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinDate">
                  Join date<span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="joinDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {joinDate ? (
                        format(joinDate, "dd MMM yyyy")
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
              <div className="space-y-2">
                <Label htmlFor="signDate">Sign date</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => setSignDate(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="signDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {signDate ? (
                          format(signDate, "dd MMM yyyy")
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
            
            {/* Branch & Organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={formValues.branch} onValueChange={(value) => handleSelectChange("branch", value)}>
                  <SelectTrigger id="branch" className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                    </div>
                    <SelectItem value="No branch">No branch</SelectItem>
                    <SelectItem value="Pusat">Pusat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">
                  Organization<span className="text-red-500">*</span>
                </Label>
                <Select value={formValues.organization} onValueChange={(value) => handleSelectChange("organization", value)}>
                  <SelectTrigger id="organization" className="w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="flex w-full items-center gap-2 py-1 text-blue-600"
                        onClick={() => setNewOrgDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add new organization
                      </Button>
                    </div>
                    <SelectItem value="org1">Organization 1</SelectItem>
                    <SelectItem value="org2">Organization 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Job Position & Job Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobPosition">
                  Job position<span className="text-red-500">*</span>
                </Label>
                <Select value={formValues.jobPosition} onValueChange={(value) => handleSelectChange("jobPosition", value)}>
                  <SelectTrigger id="jobPosition" className="w-full">
                    <SelectValue placeholder="Select job position" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="flex w-full items-center gap-2 py-1 text-blue-600"
                        onClick={() => setNewPositionDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add new job position
                      </Button>
                    </div>
                    <SelectItem value="pos1">Position 1</SelectItem>
                    <SelectItem value="pos2">Position 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobLevel">
                  Job level<span className="text-red-500">*</span>
                </Label>
                <Select value={formValues.jobLevel} onValueChange={(value) => handleSelectChange("jobLevel", value)}>
                  <SelectTrigger id="jobLevel" className="w-full">
                    <SelectValue placeholder="Select job level" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 opacity-70" />
                        <Input placeholder="Search" className="h-8" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="flex w-full items-center gap-2 py-1 text-blue-600"
                        onClick={() => setNewLevelDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add new job level
                      </Button>
                    </div>
                    <SelectItem value="level1">Level 1</SelectItem>
                    <SelectItem value="level2">Level 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Grade & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={formValues.grade} onValueChange={(value) => handleSelectChange("grade", value)}>
                  <SelectTrigger id="grade" className="w-full">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade1">Grade 1</SelectItem>
                    <SelectItem value="grade2">Grade 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={formValues.class} onValueChange={(value) => handleSelectChange("class", value)}>
                  <SelectTrigger id="class" className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class1">Class 1</SelectItem>
                    <SelectItem value="class2">Class 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Schedule */}
            <div className="space-y-2">
              <Label htmlFor="schedule">
                Schedule<span className="text-red-500">*</span>
              </Label>
              <Select value={formValues.schedule} onValueChange={(value) => handleSelectChange("schedule", value)}>
                <SelectTrigger id="schedule" className="w-full">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule1">Office Hour (9 AM - 5 PM)</SelectItem>
                  <SelectItem value="schedule2">Shift 1 (7 AM - 3 PM)</SelectItem>
                  <SelectItem value="schedule3">Shift 2 (3 PM - 11 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Approval Line & Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="approvalLine">Approval line</Label>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
                </div>
                <Select value={formValues.approvalLine} onValueChange={(value) => handleSelectChange("approvalLine", value)}>
                  <SelectTrigger id="approvalLine" className="w-full">
                    <SelectValue placeholder="Select approval line" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approvalLine1">Approval Line 1</SelectItem>
                    <SelectItem value="approvalLine2">Approval Line 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="manager">Manager</Label>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
                </div>
                <Select value={formValues.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                  <SelectTrigger id="manager" className="w-full">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager1">John Doe</SelectItem>
                    <SelectItem value="manager2">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* SBU */}
            <div className="space-y-4">
              <Label htmlFor="sbu">SBU</Label>
              
              {/* SBU List */}
              {sbuList.map((sbu, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="grid grid-cols-2 gap-2 flex-grow">
                    <Select 
                      value={sbu.group}
                      onValueChange={(value) => handleSaveSBU(index, value, sbu.name)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SBU Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group1">SBU Group 1</SelectItem>
                        <SelectItem value="group2">SBU Group 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={sbu.name}
                      onValueChange={(value) => handleSaveSBU(index, sbu.group, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SBU" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sbu1">SBU 1</SelectItem>
                        <SelectItem value="sbu2">SBU 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 mt-0"
                    onClick={() => handleRemoveSBU(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {/* Add SBU Button */}
              <Button 
                type="button" 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={handleAddSBU}
              >
                <Plus className="h-4 w-4" /> Add SBU
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === FormStep.PAYROLL && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Payroll information</h2>
            <p className="text-gray-500">This step will be implemented in the next phase.</p>
          </div>
        )}
        
        {currentStep === FormStep.INVITE && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Invite employee</h2>
            <p className="text-gray-500">This step will be implemented in the next phase.</p>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-end gap-2 mt-8">
          {currentStep > FormStep.PERSONAL_DATA && (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          )}
          {currentStep === FormStep.PERSONAL_DATA && (
            <Button variant="outline" asChild>
              <Link to="/hr/data">Cancel</Link>
            </Button>
          )}
          <Button onClick={handleNextStep}>
            {currentStep === FormStep.INVITE ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Card>

      {/* Dialog for adding new employment status */}
      <Dialog open={newStatusDialogOpen} onOpenChange={setNewStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new status</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statusName">Name<span className="text-red-500">*</span></Label>
              <Input 
                id="statusName" 
                name="statusName"
                value={formValues.statusName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="hasEndDate" 
                checked={formValues.statusHasEndDate}
                onCheckedChange={(checked) => {
                  setFormValues({
                    ...formValues,
                    statusHasEndDate: checked as boolean
                  });
                }}
              />
              <Label 
                htmlFor="hasEndDate" 
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This status have end date<br />(eg. contract, probation etc)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleCreateNewStatus}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding new organization */}
      <Dialog open={newOrgDialogOpen} onOpenChange={setNewOrgDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new organization</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orgCode">Organization code</Label>
              <Input 
                id="orgCode" 
                name="orgCode"
                value={formValues.orgCode}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization name<span className="text-red-500">*</span></Label>
              <Input 
                id="orgName" 
                name="orgName"
                value={formValues.orgName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="parentOrg">Parent organization</Label>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
              </div>
              <Select value={formValues.parentOrg} onValueChange={(value) => handleSelectChange("parentOrg", value)}>
                <SelectTrigger id="parentOrg">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent1">Parent Org 1</SelectItem>
                  <SelectItem value="parent2">Parent Org 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleCreateNewOrg}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding new job position */}
      <Dialog open={newPositionDialogOpen} onOpenChange={setNewPositionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create job position</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="positionCode">Job position code</Label>
              <Input 
                id="positionCode" 
                name="positionCode"
                value={formValues.positionCode}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="positionName">Job position name<span className="text-red-500">*</span></Label>
              <Input 
                id="positionName" 
                name="positionName"
                value={formValues.positionName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="parentPosition">Parent job position</Label>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs cursor-help">i</div>
              </div>
              <Select value={formValues.parentPosition} onValueChange={(value) => handleSelectChange("parentPosition", value)}>
                <SelectTrigger id="parentPosition">
                  <SelectValue placeholder="Select parent job position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parentPos1">Parent Position 1</SelectItem>
                  <SelectItem value="parentPos2">Parent Position 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateNewPosition}>Save</Button>
            <Button type="button" onClick={handleCreateNewPosition}>Save and add other</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding new job level */}
      <Dialog open={newLevelDialogOpen} onOpenChange={setNewLevelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new job level</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="levelCode">Job level code</Label>
              <Input 
                id="levelCode" 
                name="levelCode"
                value={formValues.levelCode}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="levelName">Job level name<span className="text-red-500">*</span></Label>
              <Input 
                id="levelName" 
                name="levelName"
                value={formValues.levelName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewLevelDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateNewLevel}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
