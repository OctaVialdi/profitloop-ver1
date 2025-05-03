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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
            1
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
        
        {/* Add more steps as needed for Employment data, Payroll, and Invite */}
        {currentStep === FormStep.EMPLOYMENT_DATA && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Employment data</h2>
            <p className="text-gray-500">This step will be implemented in the next phase.</p>
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
              Cancel
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
    </div>
  );
}
