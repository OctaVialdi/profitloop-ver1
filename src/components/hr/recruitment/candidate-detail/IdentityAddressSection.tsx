
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { format } from "date-fns";

interface IdentityAddressSectionProps {
  candidate: CandidateWithDetails;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  candidate
}) => {
  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Identity & Address</h2>
        </div>
        
        <div className="border rounded-md">
          <div className="flex justify-between items-center p-3 border-b">
            <div></div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">NIK</p>
                <p className="font-medium">{candidate.nik || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport number</p>
                <p className="font-medium">{candidate.passport_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport expiry</p>
                <p className="font-medium">
                  {candidate.passport_expiry 
                    ? format(new Date(candidate.passport_expiry), "dd MMM yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal code</p>
                <p className="font-medium">{candidate.postal_code || "-"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Citizen address</p>
              <p className="font-medium">{candidate.citizen_address || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Residential address</p>
              <p className="font-medium">{candidate.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
