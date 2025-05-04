
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { FormValues } from "../../types";

interface IdentityAddressSectionProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  passportExpiry: Date | undefined;
  setPassportExpiry: React.Dispatch<React.SetStateAction<Date | undefined>>;
  useResidentialAddress: boolean;
  setUseResidentialAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  formValues,
  setFormValues,
  passportExpiry,
  setPassportExpiry,
  useResidentialAddress,
  setUseResidentialAddress,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePassportExpiryChange = (date: Date | undefined) => {
    setPassportExpiry(date);
    if (date) {
      setFormValues(prev => ({ ...prev, passportExpiry: date }));
    }
  };

  const handleUseResidentialAddress = (checked: boolean) => {
    setUseResidentialAddress(checked);
    if (checked && formValues.citizenAddress) {
      setFormValues(prev => ({ ...prev, residentialAddress: formValues.citizenAddress }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Identity and address</h3>
        <p className="text-sm text-gray-500">Information related to identity documents and addresses</p>
      </div>
      
      {/* Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nik">NIK</Label>
          <Input 
            id="nik"
            placeholder="National Identity Number" 
            value={formValues.nik || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport number</Label>
          <Input 
            id="passportNumber" 
            placeholder="Passport number"
            value={formValues.passportNumber || ''}
            onChange={handleChange}
          />
        </div>
        
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
                onSelect={handlePassportExpiryChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Address */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input 
            id="postalCode" 
            placeholder="Postal code" 
            value={formValues.postalCode || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="citizenAddress">Citizen ID address</Label>
          <Input 
            id="citizenAddress" 
            placeholder="Address as shown on identity card"
            value={formValues.citizenAddress || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-start space-x-2 mt-2">
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
              placeholder="Current residential address"
              value={formValues.residentialAddress || ''} 
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
