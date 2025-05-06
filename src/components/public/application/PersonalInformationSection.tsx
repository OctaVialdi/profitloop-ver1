
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalInformationProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const PersonalInformationSection: React.FC<PersonalInformationProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <p className="text-sm text-muted-foreground">Please enter your personal details.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="required">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="required">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        {/* New Position Field */}
        <div className="space-y-2">
          <Label htmlFor="position" className="required">Position Applied For</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => updateFormData('position', e.target.value)}
            placeholder="Enter desired position"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mobilePhone">Mobile Phone</Label>
          <Input
            id="mobilePhone"
            value={formData.mobilePhone}
            onChange={(e) => updateFormData('mobilePhone', e.target.value)}
            placeholder="Enter your mobile phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthPlace">Place of Birth</Label>
          <Input
            id="birthPlace"
            value={formData.birthPlace}
            onChange={(e) => updateFormData('birthPlace', e.target.value)}
            placeholder="Enter your place of birth"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.birthdate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthdate ? format(formData.birthdate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.birthdate}
                onSelect={(date) => updateFormData('birthdate', date)}
                disabled={(date) => date > new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => updateFormData('maritalStatus', value)}>
            <SelectTrigger>
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
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select value={formData.bloodType} onValueChange={(value) => updateFormData('bloodType', value)}>
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <Label htmlFor="religion">Religion</Label>
          <Select value={formData.religion} onValueChange={(value) => updateFormData('religion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="islam">Islam</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="catholic">Catholic</SelectItem>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="buddha">Buddha</SelectItem>
              <SelectItem value="konghucu">Konghucu</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
