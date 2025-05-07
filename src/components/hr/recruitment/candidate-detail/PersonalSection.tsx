
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { format } from "date-fns";

interface PersonalSectionProps {
  candidate: CandidateWithDetails;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  candidate
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal Information</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Basic information</h3>
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <div></div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full name</p>
                  <p className="font-medium">{candidate.full_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{candidate.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{candidate.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Birthdate</p>
                  <p className="font-medium">
                    {candidate.birth_date 
                      ? format(new Date(candidate.birth_date), "dd MMM yyyy")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Birth place</p>
                  <p className="font-medium">{candidate.birth_place || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">
                    {candidate.gender 
                      ? candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-medium">
                    {candidate.religion 
                      ? candidate.religion.charAt(0).toUpperCase() + candidate.religion.slice(1)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood type</p>
                  <p className="font-medium">{candidate.blood_type || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital status</p>
                  <p className="font-medium">
                    {candidate.marital_status 
                      ? candidate.marital_status.charAt(0).toUpperCase() + candidate.marital_status.slice(1)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
