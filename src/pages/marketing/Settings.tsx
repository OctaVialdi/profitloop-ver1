
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define interfaces
interface ContentType {
  id: string;
  name: string;
}

interface ServiceOption {
  id: string;
  name: string;
}

interface SubServiceOption {
  id: string;
  parentId: string;
  name: string;
}

interface ContentPillarOption {
  id: string;
  name: string;
}

const Settings = () => {
  const { employees, isLoading } = useEmployees();
  const [filteredEmployees, setFilteredEmployees] = useState<LegacyEmployee[]>([]);
  const [activeTab, setActiveTab] = useState("team-members");
  
  // State for content types management
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [newContentType, setNewContentType] = useState("");

  // State for services management
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [newService, setNewService] = useState("");

  // State for sub-services management
  const [subServices, setSubServices] = useState<SubServiceOption[]>([]);
  const [newSubService, setNewSubService] = useState("");
  const [selectedServiceForSub, setSelectedServiceForSub] = useState("");

  // State for content pillars management
  const [contentPillars, setContentPillars] = useState<ContentPillarOption[]>([]);
  const [newContentPillar, setNewContentPillar] = useState("");

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
      setContentTypes(JSON.parse(storedTypes));
    }

    const storedServices = localStorage.getItem("marketingServices");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }

    const storedSubServices = localStorage.getItem("marketingSubServices");
    if (storedSubServices) {
      setSubServices(JSON.parse(storedSubServices));
    }

    const storedPillars = localStorage.getItem("marketingContentPillars");
    if (storedPillars) {
      setContentPillars(JSON.parse(storedPillars));
    }
  }, []);

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
      id: `ct-${Date.now()}`,
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

  // Function to add a new service
  const handleAddService = () => {
    if (newService.trim() === "") {
      toast.error("Service name cannot be empty");
      return;
    }
    
    // Check if service already exists
    if (services.some(service => service.name.toLowerCase() === newService.toLowerCase())) {
      toast.error("This service already exists");
      return;
    }
    
    const newServiceItem = {
      id: `s-${Date.now()}`,
      name: newService
    };
    
    setServices([...services, newServiceItem]);
    setNewService("");
    toast.success("Service added");
  };

  // Function to delete a service
  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    // Also delete associated sub-services
    setSubServices(subServices.filter(subService => subService.parentId !== id));
    toast.success("Service and associated sub-services deleted");
  };

  // Function to add a new sub-service
  const handleAddSubService = () => {
    if (newSubService.trim() === "") {
      toast.error("Sub-service name cannot be empty");
      return;
    }

    if (!selectedServiceForSub) {
      toast.error("Please select a parent service");
      return;
    }
    
    // Check if sub-service already exists under this parent
    if (subServices.some(
      subService => 
        subService.name.toLowerCase() === newSubService.toLowerCase() &&
        subService.parentId === selectedServiceForSub
    )) {
      toast.error("This sub-service already exists under the selected service");
      return;
    }
    
    const newSubServiceItem = {
      id: `ss-${Date.now()}`,
      parentId: selectedServiceForSub,
      name: newSubService
    };
    
    setSubServices([...subServices, newSubServiceItem]);
    setNewSubService("");
    toast.success("Sub-service added");
  };

  // Function to delete a sub-service
  const handleDeleteSubService = (id: string) => {
    setSubServices(subServices.filter(subService => subService.id !== id));
    toast.success("Sub-service deleted");
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
    
    const newPillar = {
      id: `p-${Date.now()}`,
      name: newContentPillar
    };
    
    setContentPillars([...contentPillars, newPillar]);
    setNewContentPillar("");
    toast.success("Content pillar added");
  };

  // Function to delete a content pillar
  const handleDeleteContentPillar = (id: string) => {
    setContentPillars(contentPillars.filter(pillar => pillar.id !== id));
    toast.success("Content pillar deleted");
  };

  // Store data in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("marketingContentTypes", JSON.stringify(contentTypes));
    localStorage.setItem("marketingServices", JSON.stringify(services));
    localStorage.setItem("marketingSubServices", JSON.stringify(subServices));
    localStorage.setItem("marketingContentPillars", JSON.stringify(contentPillars));
  }, [contentTypes, services, subServices, contentPillars]);

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
                    {services.length > 0 ? (
                      services.map((service) => (
                        <tr key={service.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4">{service.name}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteService(service.id)}
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
              
              <div className="flex gap-2 mb-6">
                <Select 
                  value={selectedServiceForSub} 
                  onValueChange={setSelectedServiceForSub}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="New sub-service name" 
                  value={newSubService} 
                  onChange={(e) => setNewSubService(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAddSubService} size="sm" disabled={!selectedServiceForSub}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Sub Service
                </Button>
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
                    {subServices.length > 0 ? (
                      subServices.map((subService) => {
                        const parentService = services.find(service => service.id === subService.parentId);
                        return (
                          <tr key={subService.id} className="border-t hover:bg-muted/30">
                            <td className="py-3 px-4">{subService.name}</td>
                            <td className="py-3 px-4">{parentService?.name || 'Unknown'}</td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteSubService(subService.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
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
                  placeholder="New content pillar name" 
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
                              onClick={() => handleDeleteContentPillar(pillar.id)}
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
