
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, User, Phone, Loader2 } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { employeeService } from "@/services/employeeService";

// Define the EmployeeFamily interface if not already imported
interface EmployeeFamily {
  id?: string;
  name: string;
  relationship?: string;
  gender?: string;
  age?: number;
  occupation?: string;
  phone?: string;
  address?: string;
  is_emergency_contact?: boolean;
}

interface FamilySectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const FamilySection: React.FC<FamilySectionProps> = ({
  employee,
  handleEdit
}) => {
  const [familyMembers, setFamilyMembers] = useState<EmployeeFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      setIsLoading(true);
      try {
        const data = await employeeService.getFamilyMembers(employee.id);
        setFamilyMembers(data || []);
      } catch (error) {
        console.error("Error fetching family members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (employee && employee.id) {
      fetchFamilyMembers();
    }
  }, [employee]);

  // For now, just render a placeholder section
  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Family Members</h2>
          <Button variant="outline" className="gap-2">
            <PlusCircle size={16} />
            <span>Add Family Member</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : familyMembers.length > 0 ? (
          <div className="space-y-4">
            {familyMembers.map(member => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} />
                      <span>{member.gender}, {member.age} years old</span>
                    </div>
                    
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {member.is_emergency_contact && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Emergency Contact
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No family members added yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};
