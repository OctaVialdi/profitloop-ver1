
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusSquare, Trash2, Edit } from "lucide-react";
import { useContentManagement } from "@/hooks/useContentManagement";
import { toast } from "sonner";

const SubServicesTab = () => {
  const { services, subServices, addSubService, updateSubService, deleteSubService } = useContentManagement();
  const [newSubServiceName, setNewSubServiceName] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingServiceId, setEditingServiceId] = useState("");

  const handleAddSubService = () => {
    if (!newSubServiceName.trim()) {
      toast.error("Sub-service name cannot be empty");
      return;
    }
    
    if (!selectedServiceId) {
      toast.error("Please select a parent service");
      return;
    }
    
    addSubService(selectedServiceId, newSubServiceName);
    toast.success("Sub-service added successfully");
    setNewSubServiceName("");
  };
  
  const handleStartEdit = (id: string, name: string, serviceId: string) => {
    setEditingId(id);
    setEditingName(name);
    setEditingServiceId(serviceId);
  };
  
  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim() || !editingServiceId) {
      toast.error("Sub-service name and service cannot be empty");
      return;
    }
    
    updateSubService(editingId, editingServiceId, editingName);
    toast.success("Sub-service updated successfully");
    setEditingId(null);
    setEditingName("");
    setEditingServiceId("");
  };
  
  const handleDelete = (id: string) => {
    deleteSubService(id);
    toast.success("Sub-service deleted successfully");
  };

  // Get service name by ID
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <p className="text-sm">Parent Service</p>
          <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input 
          placeholder="Enter new sub-service" 
          value={newSubServiceName} 
          onChange={(e) => setNewSubServiceName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddSubService} className="flex items-center">
          <PlusSquare className="h-4 w-4 mr-1" />
          <span>Add Sub-Service</span>
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub-Service Name</TableHead>
              <TableHead>Parent Service</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No sub-services defined. Add your first one above.
                </TableCell>
              </TableRow>
            ) : (
              subServices.map((subService) => (
                <TableRow key={subService.id}>
                  <TableCell>
                    {editingId === subService.id ? (
                      <Input 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      subService.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === subService.id ? (
                      <Select value={editingServiceId} onValueChange={setEditingServiceId}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      getServiceName(subService.serviceId)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === subService.id ? (
                      <div className="flex justify-end space-x-2">
                        <Button onClick={handleSaveEdit} size="sm">Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEdit(subService.id, subService.name, subService.serviceId)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(subService.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubServicesTab;
