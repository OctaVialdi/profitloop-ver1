
import React from "react";
import { FormValues } from "../../types";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalDataSectionProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  birthdate: Date | undefined;
  setBirthdate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
  formValues,
  setFormValues,
  birthdate,
  setBirthdate
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRadioChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Personal data</h3>
      <p className="text-sm text-gray-500 mb-4">Your email address is your identity and is used to log in.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First name */}
        <div className="space-y-2">
          <FormLabel>First name *</FormLabel>
          <FormControl>
            <Input 
              id="firstName"
              value={formValues.firstName} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Last name */}
        <div className="space-y-2">
          <FormLabel>Last name *</FormLabel>
          <FormControl>
            <Input 
              id="lastName"
              value={formValues.lastName} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Mobile phone */}
        <div className="space-y-2">
          <FormLabel>Mobile phone</FormLabel>
          <FormControl>
            <Input 
              id="mobilePhone"
              value={formValues.mobilePhone} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <FormLabel>Email *</FormLabel>
          <FormControl>
            <Input 
              id="email"
              type="email"
              value={formValues.email} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Phone */}
        <div className="space-y-2">
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input 
              id="phone"
              value={formValues.phone} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Birth place */}
        <div className="space-y-2">
          <FormLabel>Place of birth</FormLabel>
          <FormControl>
            <Input 
              id="birthPlace"
              value={formValues.birthPlace} 
              onChange={handleInputChange}
            />
          </FormControl>
        </div>
        
        {/* Birth date */}
        <div className="space-y-2">
          <FormLabel>Birthdate *</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                id="birthDate"
                value={birthdate ? birthdate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  setBirthdate(date);
                  setFormValues(prev => ({ ...prev, birthDate: e.target.value }));
                }}
                type="date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </FormControl>
        </div>
        
        {/* Gender */}
        <div className="space-y-3">
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            value={formValues.gender || ""}
            onValueChange={(value) => handleRadioChange("gender", value)}
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
        </div>
        
        {/* Marital status */}
        <div className="space-y-2">
          <FormLabel>Marital status *</FormLabel>
          <Select
            value={formValues.maritalStatus || ""}
            onValueChange={(value) => handleSelectChange("maritalStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Blood type */}
        <div className="space-y-2">
          <FormLabel>Blood type</FormLabel>
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
        
        {/* Religion */}
        <div className="space-y-2">
          <FormLabel>Religion *</FormLabel>
          <Select
            value={formValues.religion || ""}
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
  );
};
