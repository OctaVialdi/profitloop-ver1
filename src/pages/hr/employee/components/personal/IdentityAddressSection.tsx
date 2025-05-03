
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface IdentityAddressSectionProps {
  passportExpiry: Date | undefined;
  setPassportExpiry: React.Dispatch<React.SetStateAction<Date | undefined>>;
  useResidentialAddress: boolean;
  setUseResidentialAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  passportExpiry,
  setPassportExpiry,
  useResidentialAddress,
  setUseResidentialAddress,
}) => {
  const [nikValue, setNikValue] = useState<string>('');
  const [nikError, setNikError] = useState<string | null>(null);
  
  // Format and validate NPWP as it's entered
  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const value = e.target.value.replace(/\D/g, '');
    
    // Format the number with hyphens for readability: 1234-1234-1234-1234
    let formattedValue = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i === 4 || i === 8 || i === 12) {
        formattedValue += '-';
      }
      formattedValue += value[i];
    }
    
    setNikValue(formattedValue);
    
    // Validate: NPWP must be exactly 16 digits
    if (value.length > 0 && value.length !== 16) {
      setNikError('NIK (NPWP 16 digit) must be 16 digit');
    } else {
      setNikError(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-1">Identity & address</h3>
      <p className="text-sm text-gray-500 mb-4">Employee identity address information</p>
      
      {/* NIK & Passport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="nik">NIK (NPWP 16 digit)</Label>
          <Input 
            id="nik" 
            placeholder="1234-1234-1234-1234" 
            value={nikValue}
            onChange={handleNikChange}
            className={nikError ? "border-red-500" : ""}
          />
          {nikError && (
            <p className="text-sm text-red-500">{nikError}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport number</Label>
          <Input id="passportNumber" />
        </div>
      </div>
      
      {/* Passport expiry & Postal code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="space-y-2">
        <Label htmlFor="citizenAddress">Citizen ID address</Label>
        <Input id="citizenAddress" className="h-24" />
      </div>
      
      {/* Use as residential address checkbox */}
      <div className="flex items-start space-x-2">
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
  );
};
