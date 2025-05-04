
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";

interface PersonalSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  employee,
  handleEdit
}) => {
  // Helper function to format date strings for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Calculate age if birth date is available
  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return null;
    try {
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return null;
    }
  };

  const age = calculateAge(employee.birthDate);

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal</h2>
        </div>

        <Tabs defaultValue="basic-info">
          <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
            <TabsTrigger value="basic-info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Basic info
            </TabsTrigger>
            <TabsTrigger value="family" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Family
            </TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Emergency contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Personal data</h3>
                <p className="text-sm text-gray-500 mb-4">Your email address is your identity on Talenta is used to log in.</p>
                
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div></div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 flex items-center"
                      onClick={() => handleEdit("personal")}
                    >
                      <Edit size={14} /> Edit
                    </Button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full name</p>
                        <p className="font-medium">{employee.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mobile phone</p>
                        <p className="font-medium">{employee.mobilePhone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{employee.mobilePhone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Place of birth</p>
                        <p className="font-medium">{employee.birthPlace || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Birthdate</p>
                        <p className="font-medium">
                          {formatDate(employee.birthDate)} 
                          {age !== null && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{age} years old</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{employee.gender || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Marital status</p>
                        <p className="font-medium">{employee.maritalStatus || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blood type</p>
                        <p className="font-medium">{employee.bloodType || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Religion</p>
                        <p className="font-medium">{employee.religion || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Identity & Address</h3>
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div></div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 flex items-center"
                      onClick={() => handleEdit("identity")}
                    >
                      <Edit size={14} /> Edit
                    </Button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500">NIK (NPWP 16 digit)</p>
                        <p className="font-medium">{employee.nik || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Passport number</p>
                        <p className="font-medium">{employee.passportNumber || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Passport expiration date</p>
                        <p className="font-medium">{formatDate(employee.passportExpiry) || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Postal code</p>
                        <p className="font-medium">{employee.postalCode || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Citizen ID address</p>
                        <p className="font-medium">{employee.citizenAddress || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Residential address</p>
                        <p className="font-medium">{employee.address || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="family" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your family information data will be displayed here."
              section="family"
              handleEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="emergency" className="pt-6">
            <EmptyDataDisplay 
              title="There is no data to display"
              description="Your emergency contact data will be displayed here."
              section="emergency"
              handleEdit={handleEdit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

// Reusable component for empty data display
interface EmptyDataDisplayProps {
  title: string;
  description: string;
  section: string;
  handleEdit: (section: string) => void;
}

export const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({
  title,
  description,
  section,
  handleEdit
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 mb-4">
        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
      
      <div className="mt-6 flex justify-center gap-3">
        <Button size="sm" onClick={() => handleEdit(section)}>Add new</Button>
        <Button size="sm" variant="outline">Import</Button>
        <Button size="sm" variant="outline">Export</Button>
      </div>
    </div>
  );
};
