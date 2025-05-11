
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit2, CheckCircle, Loader2 } from "lucide-react";
import { organizationService } from "@/services/organizationService";
import { BillingSettings } from "@/types/organization";

interface BillingAddressFormProps {
  billingSettings: BillingSettings | null;
  organizationId: string | null;
  onUpdate: () => void;
}

export function BillingAddressForm({ 
  billingSettings, 
  organizationId, 
  onUpdate 
}: BillingAddressFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    companyName: "",
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Indonesia",
    emailBilling: "",
  });

  // Update form data when billingSettings changes
  useEffect(() => {
    if (billingSettings?.invoice_address) {
      setFormData({
        companyName: billingSettings.invoice_address?.companyName || "",
        taxId: billingSettings.invoice_address?.taxId || "",
        streetAddress: billingSettings.invoice_address?.streetAddress || "",
        city: billingSettings.invoice_address?.city || "",
        state: billingSettings.invoice_address?.state || "",
        postalCode: billingSettings.invoice_address?.postalCode || "",
        country: billingSettings.invoice_address?.country || "Indonesia",
        emailBilling: billingSettings.invoice_address?.emailBilling || "",
      });
    }
  }, [billingSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    try {
      setIsLoading(true);
      
      const updatedSettings: BillingSettings = {
        id: billingSettings?.id || undefined,
        organization_id: organizationId,
        payment_method: billingSettings?.payment_method,
        last_payment_date: billingSettings?.last_payment_date,
        invoice_address: {
          ...formData
        },
        created_at: billingSettings?.created_at,
        updated_at: new Date().toISOString()
      };
      
      await organizationService.saveBillingSettings(updatedSettings);
      
      toast.success("Billing information updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error saving billing information:", error);
      toast.error("Failed to update billing information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Billing Information</h2>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Your company name"
            />
          </div>
          <div>
            <Label htmlFor="taxId">Tax ID / NPWP</Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="00.000.000.0-000.000"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Street address"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="State or province"
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Postal code"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Country"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="emailBilling">Billing Email</Label>
            <Input
              id="emailBilling"
              name="emailBilling"
              type="email"
              value={formData.emailBilling}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="billing@yourcompany.com"
            />
          </div>
        </div>

        {isEditing && (
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Save Billing Information
              </>
            )}
          </Button>
        )}
      </form>
    </Card>
  );
}
