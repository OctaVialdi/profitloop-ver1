
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusSquare, Trash2, Edit } from "lucide-react";
import { useContentManagement } from "@/hooks/useContentManagement";
import { toast } from "sonner";

const ServicesTab = () => {
  const { services, addService, updateService, deleteService } = useContentManagement();
  const [newServiceName, setNewServiceName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }
    
    addService(newServiceName);
    toast.success("Service added successfully");
    setNewServiceName("");
  };
  
  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };
  
  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }
    
    updateService(editingId, editingName);
    toast.success("Service updated successfully");
    setEditingId(null);
    setEditingName("");
  };
  
  const handleDelete = (id: string) => {
    deleteService(id);
    toast.success("Service deleted successfully (and any associated sub-services)");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Enter new service" 
          value={newServiceName} 
          onChange={(e) => setNewServiceName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddService} className="flex items-center">
          <PlusSquare className="h-4 w-4 mr-1" />
          <span>Add Service</span>
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                  No services defined. Add your first one above.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {editingId === service.id ? (
                      <Input 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      service.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === service.id ? (
                      <div className="flex justify-end space-x-2">
                        <Button onClick={handleSaveEdit} size="sm">Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEdit(service.id, service.name)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(service.id)}
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

export default ServicesTab;
