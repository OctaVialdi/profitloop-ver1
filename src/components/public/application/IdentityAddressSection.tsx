
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdentityAddressProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const IdentityAddressSection: React.FC<IdentityAddressProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Identity & Address</h3>
      <p className="text-sm text-muted-foreground">Please enter your identification and address details.</p>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h4 className="font-medium mb-4">Identification</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK (16 digit)</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) => updateFormData('nik', e.target.value)}
                placeholder="Enter your National ID Number"
                maxLength={16}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => updateFormData('passportNumber', e.target.value)}
                placeholder="Enter your passport number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passportExpiry">Passport Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.passportExpiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.passportExpiry ? format(formData.passportExpiry, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.passportExpiry}
                    onSelect={(date) => updateFormData('passportExpiry', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateFormData('postalCode', e.target.value)}
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Address</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="citizenAddress">Citizen ID Address</Label>
              <Textarea
                id="citizenAddress"
                value={formData.citizenAddress}
                onChange={(e) => updateFormData('citizenAddress', e.target.value)}
                placeholder="Enter address as shown on your ID"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentialAddress">Residential Address</Label>
              <Textarea
                id="residentialAddress"
                value={formData.residentialAddress}
                onChange={(e) => updateFormData('residentialAddress', e.target.value)}
                placeholder="Enter your current residential address"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
