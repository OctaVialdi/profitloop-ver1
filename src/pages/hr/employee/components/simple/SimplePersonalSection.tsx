
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

interface SimplePersonalSectionProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleSelectChange: (name: string, value: string) => void;
}

export const SimplePersonalSection: React.FC<SimplePersonalSectionProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate,
  handleSelectChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
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
    <div className="space-y-6">
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name<span className="text-red-500">*</span></Label>
          <Input 
            id="firstName" 
            placeholder="First name"
            value={formValues.firstName || ''} 
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input 
            id="lastName" 
            placeholder="Last name"
            value={formValues.lastName || ''} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobilePhone">Mobile phone</Label>
          <Input 
            id="mobilePhone" 
            placeholder="Mobile phone number"
            value={formValues.mobilePhone || ''} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* Gender and Marital Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital status<span className="text-red-500">*</span></Label>
          <Select 
            value={formValues.maritalStatus || "single"} 
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
      </div>
      
      {/* Birth info and Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthdate">Birthdate</Label>
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
                onSelect={handleBirthdateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="religion">Religion<span className="text-red-500">*</span></Label>
          <Select
            value={formValues.religion || "islam"}
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
