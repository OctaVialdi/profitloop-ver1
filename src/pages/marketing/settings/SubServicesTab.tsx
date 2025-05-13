
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SubServicesTab() {
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [newSubService, setNewSubService] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchSubServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setServices(data || []);
      if (data && data.length > 0 && !selectedService) {
        setSelectedService(data[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  const fetchSubServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sub_services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setSubServices(data || []);
    } catch (error: any) {
      console.error("Error fetching sub services:", error);
      toast({
        title: "Error",
        description: "Failed to load sub services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSubService = async () => {
    if (!newSubService.trim() || !selectedService) return;
    
    try {
      const { error } = await supabase
        .from("sub_services")
        .insert({ 
          name: newSubService.trim(),
          service_id: selectedService
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sub service added successfully",
      });
      
      setNewSubService("");
      fetchSubServices();
    } catch (error: any) {
      console.error("Error adding sub service:", error);
      toast({
        title: "Error",
        description: "Failed to add sub service",
        variant: "destructive",
      });
    }
  };

  const deleteSubService = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sub_services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sub service deleted successfully",
      });
      
      fetchSubServices();
    } catch (error: any) {
      console.error("Error deleting sub service:", error);
      toast({
        title: "Error",
        description: "Failed to delete sub service",
        variant: "destructive",
      });
    }
  };

  // Filter sub-services by selected service
  const filteredSubServices = selectedService 
    ? subServices.filter(subService => subService.service_id === selectedService) 
    : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select 
          value={selectedService || ""} 
          onValueChange={setSelectedService}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Enter new sub-service"
          value={newSubService}
          onChange={(e) => setNewSubService(e.target.value)}
          className="max-w-sm"
          disabled={!selectedService}
        />
        <Button 
          onClick={addSubService} 
          disabled={!newSubService.trim() || !selectedService || isLoading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {!selectedService && (
            <p className="text-sm text-muted-foreground">Please select a service first.</p>
          )}
          {selectedService && filteredSubServices.length === 0 && (
            <p className="text-sm text-muted-foreground">No sub-services defined for this service yet.</p>
          )}
          {selectedService && filteredSubServices.length > 0 && (
            <ul className="space-y-2">
              {filteredSubServices.map((subService) => (
                <li key={subService.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{subService.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteSubService(subService.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
