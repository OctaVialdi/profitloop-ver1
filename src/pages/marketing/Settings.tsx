import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// Define the ContentType interface
interface ContentType {
  id: string;
  name: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { employees, isLoading, deleteEmployee } = useEmployees();
  const [filteredEmployees, setFilteredEmployees] = useState<LegacyEmployee[]>([]);
  const [activeTab, setActiveTab] = useState("team-members");
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserOrg, setCurrentUserOrg] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
      
      // Set current user's role and organization based on some logic
      // For demo purposes, we'll check if there's a "Manager" in Digital Marketing
      const currentUserInfo = employees
        .map(convertToLegacyFormat)
        .find(emp => emp.jobLevel === "Manager" && emp.organization === "Digital Marketing");
      
      if (currentUserInfo) {
        setCurrentUserRole(currentUserInfo.jobLevel || null);
        setCurrentUserOrg(currentUserInfo.organization || null);
      }
    }
  }, [employees]);

  // Check if current user is a Manager in Digital Marketing
  const isManager = useMemo(() => {
    return currentUserRole === "Manager" && currentUserOrg === "Digital Marketing";
  }, [currentUserRole, currentUserOrg]);

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

  // Handle click on employee name to navigate to employee detail
  const handleEmployeeClick = (employee: LegacyEmployee) => {
    navigate(`/my-info/personal?id=${employee.id}`);
  };

  // Handle checkbox selection
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Handle select all employees
  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(employee => employee.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      // Close the dialog first
      setIsDeleteDialogOpen(false);
      
      let successCount = 0;
      
      // Delete each selected employee
      for (const employeeId of selectedEmployees) {
        try {
          await deleteEmployee(employeeId);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete employee ${employeeId}:`, error);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} team member${successCount > 1 ? 's' : ''}`);
        // Clear selection
        setSelectedEmployees([]);
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Failed to delete some team members");
    }
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
          </TabsList>
          
          <TabsContent value="team-members">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Marketing Team Members</h2>
                {isManager && selectedEmployees.length > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedEmployees.length})
                  </Button>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="relative">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-white">
                        <TableRow>
                          {isManager && (
                            <TableHead className="w-10">
                              <Checkbox 
                                checked={
                                  filteredEmployees.length > 0 && 
                                  selectedEmployees.length === filteredEmployees.length
                                }
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                          )}
                          <TableHead className="w-[200px]">Employee name</TableHead>
                          <TableHead className="w-[120px]">Employee ID</TableHead>
                          <TableHead className="w-[150px]">Organization</TableHead>
                          <TableHead className="w-[150px]">Job position</TableHead>
                          <TableHead className="w-[120px]">Job level</TableHead>
                          <TableHead className="w-[150px]">Employment status</TableHead>
                          <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id} className="border-t hover:bg-muted/30">
                            {isManager && (
                              <TableCell>
                                <Checkbox 
                                  checked={selectedEmployees.includes(employee.id)}
                                  onCheckedChange={() => handleSelectEmployee(employee.id)}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleEmployeeClick(employee)}
                              >
                                <Avatar className="h-8 w-8">
                                  <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
                                    {employee.name.charAt(0)}
                                  </div>
                                </Avatar>
                                <div className="text-blue-600 hover:underline">{employee.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.employeeId || employee.employee_id || '-'}</TableCell>
                            <TableCell>{employee.organization || '-'}</TableCell>
                            <TableCell>{employee.jobPosition || '-'}</TableCell>
                            <TableCell>{employee.jobLevel || '-'}</TableCell>
                            <TableCell>{employee.employmentStatus || '-'}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEmployeeClick(employee)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredEmployees.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={isManager ? 8 : 7} className="text-center py-8">
                              No Digital Marketing employees found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
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

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Team Members</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedEmployees.length} selected team member{selectedEmployees.length > 1 ? 's' : ''}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Settings;
