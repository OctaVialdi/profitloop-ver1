
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Define the ContentType interface
interface ContentType {
  id: string;
  name: string;
}

const Settings = () => {
  const { employees, isLoading } = useEmployees();
  const [filteredEmployees, setFilteredEmployees] = useState<LegacyEmployee[]>([]);
  const [activeTab, setActiveTab] = useState("team-members");
  
  // State for content types management
  const [contentTypes, setContentTypes] = useState<ContentType[]>([
    { id: "1", name: "Image Post" },
    { id: "2", name: "Video Post" },
    { id: "3", name: "Story" },
    { id: "4", name: "Carousel" }
  ]);
  const [newContentType, setNewContentType] = useState("");

  useEffect(() => {
    // Filter employees by organization "Digital Marketing" when employees data changes
    if (employees.length > 0) {
      const marketingEmployees = employees
        .map(convertToLegacyFormat)
        .filter(employee => employee.organization === "Digital Marketing");
      
      setFilteredEmployees(marketingEmployees);
    }
  }, [employees]);

  // Function to add a new content type
  const handleAddContentType = () => {
    if (newContentType.trim() === "") {
      toast.error("Content type name cannot be empty");
      return;
    }
    
    // Check if content type already exists
    if (contentTypes.some(type => type.name.toLowerCase() === newContentType.toLowerCase())) {
      toast.error("This content type already exists");
      return;
    }
    
    const newType = {
      id: `${Date.now()}`,
      name: newContentType
    };
    
    setContentTypes([...contentTypes, newType]);
    setNewContentType("");
    toast.success("Content type added");
  };

  // Function to delete a content type
  const handleDeleteContentType = (id: string) => {
    setContentTypes(contentTypes.filter(type => type.id !== id));
    toast.success("Content type deleted");
  };

  // Store content types in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("marketingContentTypes", JSON.stringify(contentTypes));
  }, [contentTypes]);

  // Load content types from localStorage on component mount
  useEffect(() => {
    const storedTypes = localStorage.getItem("marketingContentTypes");
    if (storedTypes) {
      setContentTypes(JSON.parse(storedTypes));
    }
  }, []);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Marketing Settings</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="team-members">Team Members</TabsTrigger>
            <TabsTrigger value="content-types">Content Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team-members">
            <div>
              <h2 className="text-lg font-medium mb-4">Marketing Team Members</h2>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Employee ID</th>
                        <th className="py-3 px-4 text-left font-medium">Email</th>
                        <th className="py-3 px-4 text-left font-medium">Job Position</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{employee.name}</td>
                          <td className="py-3 px-4">{employee.employeeId || employee.employee_id}</td>
                          <td className="py-3 px-4">{employee.email}</td>
                          <td className="py-3 px-4">{employee.jobPosition}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              employee.status === 'Resigned' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {employee.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">
                    No Digital Marketing employees found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="content-types">
            <div>
              <h2 className="text-lg font-medium mb-4">Content Types</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add or remove content types that will be available in the content management table.
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input 
                  placeholder="New content type name" 
                  value={newContentType} 
                  onChange={(e) => setNewContentType(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddContentType} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Type
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentTypes.length > 0 ? (
                      contentTypes.map((type) => (
                        <tr key={type.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{type.name}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteContentType(type.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-6 text-center text-muted-foreground">
                          No content types defined yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Settings;
