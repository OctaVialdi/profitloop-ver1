
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { Badge } from "@/components/ui/badge";

interface FamilySectionProps {
  candidate: CandidateWithDetails;
}

export const FamilySection: React.FC<FamilySectionProps> = ({
  candidate
}) => {
  const hasFamilyMembers = candidate.familyMembers && candidate.familyMembers.length > 0;

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Family</h2>
        </div>
        
        {hasFamilyMembers ? (
          <div className="space-y-4">
            {candidate.familyMembers!.map((member, index) => (
              <div key={member.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-700">{member.relationship || "Family Member"}</p>
                  </div>
                  {member.is_emergency_contact && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      Emergency Contact
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {member.gender && (
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</p>
                    </div>
                  )}
                  
                  {member.age !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p>{member.age} years</p>
                    </div>
                  )}
                  
                  {member.occupation && (
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p>{member.occupation}</p>
                    </div>
                  )}
                  
                  {member.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{member.phone}</p>
                    </div>
                  )}
                </div>
                
                {member.address && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{member.address}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md">
            <p className="text-gray-500">No family members data provided</p>
          </div>
        )}
      </div>
    </Card>
  );
};
