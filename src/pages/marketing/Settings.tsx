
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  useContentManagement, 
  ContentType, 
  Service, 
  SubService, 
  ContentPillar
} from "@/hooks/useContentManagement";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Settings = () => {
  const { employees, isLoading } = useEmployees();
  const { 
    contentTypes, 
    servicesList, 
    subServicesList, 
    contentPillars, 
    addService, 
    deleteService, 
    addSubService, 
    deleteSubService, 
    addContentPillar, 
    deleteContentPillar
  } = useContentManagement();

  const [filteredEmployees, setFilteredEmployees] = useState<LegacyEmployee[]>([]);
  const [activeTab, setActiveTab] = useState("team-members");
  
  // State for form inputs
  const [newContentType, setNewContentType] = useState("");
  const [newService, setNewService] = useState("");
  const [newSubService, setNewSubService] = useState("");
  const [selectedParentService, setSelectedParentService] = useState("");
  const [newContentPillar, setNewContentPillar] = useState("");

  // State for stored items
  const [storedContentTypes, setStoredContentTypes] = useState<ContentType[]>([]);

  useEffect(() => {
    // Filter employees by organization "Digital Marketing" when employees data changes
    if (employees.length > 0) {
      const marketingEmployees = employees
        .map(convertToLegacyFormat)
        .filter(employee => employee.organization === "Digital Marketing");
      
      setFilteredEmployees(marketingEmployees);
    }
  }, [employees]);

  // Load content types from localStorage on component mount
  useEffect(() => {
    const storedTypes = localStorage.getItem("marketingContentTypes");
    if (storedTypes) {
      setStoredContentTypes(JSON.parse(storedTypes));
    } else {
      const defaultTypes = [
        { id: "1", name: "Image Post" },
        { id: "2", name: "Video Post" },
        { id: "3", name: "Story" },
        { id: "4", name: "Carousel" }
      ];
      setStoredContentTypes(defaultTypes);
      localStorage.setItem("marketingContentTypes", JSON.stringify(defaultTypes));
    }
  }, []);

  // Function to add a new content type
  const handleAddContentType = () => {
    if (newContentType.trim() === "") {
      toast.error("Content type name cannot be empty");
      return;
    }
    
    // Check if content type already exists
    if (storedContentTypes.some(type => type.name.toLowerCase() === newContentType.toLowerCase())) {
      toast.error("This content type already exists");
      return;
    }
    
    const newType = {
      id: `${Date.now()}`,
      name: newContentType
    };
    
    setStoredContentTypes([...storedContentTypes, newType]);
    localStorage.setItem("marketingContentTypes", JSON.stringify([...storedContentTypes, newType]));
    setNewContentType("");
    toast.success("Content type added");
  };

  // Function to delete a content type
  const handleDeleteContentType = (id: string) => {
    const updatedTypes = storedContentTypes.filter(type => type.id !== id);
    setStoredContentTypes(updatedTypes);
    localStorage.setItem("marketingContentTypes", JSON.stringify(updatedTypes));
    toast.success("Content type deleted");
  };

  // Function to add a new service
  const handleAddService = () => {
    if (newService.trim() === "") {
      toast.error("Service name cannot be empty");
      return;
    }
    
    // Check if service already exists
    if (servicesList.some(service => service.name.toLowerCase() === newService.toLowerCase())) {
      toast.error("This service already exists");
      return;
    }
    
    addService(newService);
    setNewService("");
    toast.success("Service added");
  };

  // Function to add a new sub-service
  const handleAddSubService = () => {
    if (newSubService.trim() === "") {
      toast.error("Sub-service name cannot be empty");
      return;
    }
    
    if (!selectedParentService) {
      toast.error("Please select a parent service");
      return;
    }
    
    // Check if sub-service already exists under this parent
    if (subServicesList.some(
      subService => 
        subService.name.toLowerCase() === newSubService.toLowerCase() && 
        subService.parentId === selectedParentService
    )) {
      toast.error("This sub-service already exists under the selected service");
      return;
    }
    
    addSubService(newSubService, selectedParentService);
    setNewSubService("");
    toast.success("Sub-service added");
  };

  // Function to add a new content pillar
  const handleAddContentPillar = () => {
    if (newContentPillar.trim() === "") {
      toast.error("Content pillar name cannot be empty");
      return;
    }
    
    // Check if content pillar already exists
    if (contentPillars.some(pillar => pillar.name.toLowerCase() === newContentPillar.toLowerCase())) {
      toast.error("This content pillar already exists");
      return;
    }
    
    addContentPillar(newContentPillar);
    setNewContentPillar("");
    toast.success("Content pillar added");
  };

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
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="sub-services">Sub Services</TabsTrigger>
            <TabsTrigger value="content-pillars">Content Pillars</TabsTrigger>
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
                    {storedContentTypes.length > 0 ? (
                      storedContentTypes.map((type) => (
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
          
          <TabsContent value="services">
            <div>
              <h2 className="text-lg font-medium mb-4">Services</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add or remove services that will be available in the content management table.
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input 
                  placeholder="New service name" 
                  value={newService} 
                  onChange={(e) => setNewService(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddService} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Service
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
                    {servicesList.length > 0 ? (
                      servicesList.map((service) => (
                        <tr key={service.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{service.name}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteService(service.id)}
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
                          No services defined yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sub-services">
            <div>
              <h2 className="text-lg font-medium mb-4">Sub Services</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add or remove sub-services that will be available in the content management table.
              </p>
              
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex gap-2">
                  <Select 
                    value={selectedParentService} 
                    onValueChange={setSelectedParentService}
                  >
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select parent service" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesList.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="New sub-service name" 
                    value={newSubService} 
                    onChange={(e) => setNewSubService(e.target.value)}
                    className="max-w-sm"
                    disabled={!selectedParentService}
                  />
                  <Button 
                    onClick={handleAddSubService} 
                    size="sm" 
                    disabled={!selectedParentService}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Sub-Service
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Parent Service</th>
                      <th className="py-3 px-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subServicesList.length > 0 ? (
                      subServicesList.map((subService) => (
                        <tr key={subService.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{subService.name}</td>
                          <td className="py-3 px-4">
                            {servicesList.find(service => service.id === subService.parentId)?.name || "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteSubService(subService.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-muted-foreground">
                          No sub-services defined yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content-pillars">
            <div>
              <h2 className="text-lg font-medium mb-4">Content Pillars</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add or remove content pillars that will be available in the content management table.
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input 
                  placeholder="New content pillar" 
                  value={newContentPillar} 
                  onChange={(e) => setNewContentPillar(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddContentPillar} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Content Pillar
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
                    {contentPillars.length > 0 ? (
                      contentPillars.map((pillar) => (
                        <tr key={pillar.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{pillar.name}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteContentPillar(pillar.id)}
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
                          No content pillars defined yet
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
