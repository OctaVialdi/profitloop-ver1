
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormValues } from "../types";

interface PersonalDataStepProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  passportExpiry: Date | undefined;
  setPassportExpiry: React.Dispatch<React.SetStateAction<Date | undefined>>;
  useResidentialAddress: boolean;
  setUseResidentialAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate,
  passportExpiry,
  setPassportExpiry,
  useResidentialAddress,
  setUseResidentialAddress,
}) => {
  return (
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
  );
};
