
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../../types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PersonalInfoSectionProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormValues(prev => ({ ...prev, gender: value }));
  };

  const handleBirthdateChange = (date: Date | undefined) => {
    setBirthdate(date);
    if (date) {
      setFormValues(prev => ({ ...prev, birthdate: date }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">Name<span className="text-red-500">*</span></Label>
        <div className="flex gap-4">
          <Input 
            id="firstName" 
            placeholder="First name"
            value={formValues.firstName || ''} 
            onChange={handleChange}
            required
            autoFocus
          />
          <Input 
            id="lastName" 
            placeholder="Last name"
            value={formValues.lastName || ''} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="example@company.com"
          value={formValues.email || ''} 
          onChange={handleChange}
          required
        />
        <p className="text-xs text-gray-500">This email is used for login</p>
      </div>
      
      {/* Phone numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mobilePhone">Mobile phone</Label>
          <Input 
            id="mobilePhone" 
            placeholder="Mobile phone number"
            value={formValues.mobilePhone || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            placeholder="0"
            value={formValues.phone || ''} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* Birth info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthPlace">Place of birth</Label>
          <Input 
            id="birthPlace" 
            placeholder="City of birth"
            value={formValues.birthPlace || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthdate">Birthdate<span className="text-red-500">*</span></Label>
          <BirthdateSelector 
            birthdate={birthdate} 
            setBirthdate={handleBirthdateChange} 
          />
        </div>
      </div>
      
      {/* Gender */}
      <div className="space-y-2">
        <Label>Gender<span className="text-red-500">*</span></Label>
        <RadioGroup 
          value={formValues.gender || "male"} 
          onValueChange={handleGenderChange}
          className="flex gap-4"
        >
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
        <Select 
          value={formValues.maritalStatus || ""} 
          onValueChange={(value) => handleSelectChange("maritalStatus", value)}
        >
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
          <Select
            value={formValues.bloodType || ""}
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
        <div className="space-y-2">
          <Label htmlFor="religion">Religion<span className="text-red-500">*</span></Label>
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
      </div>
    </div>
  );
};

const BirthdateSelector: React.FC<{
  birthdate: Date | undefined;
  setBirthdate: (date: Date | undefined) => void;
}> = ({ birthdate, setBirthdate }) => {
  return (
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
  );
};
