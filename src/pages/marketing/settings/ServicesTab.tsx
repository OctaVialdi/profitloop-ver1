import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ServicesTab() {
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast("Error", {
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addService = async () => {
    if (!newService.trim()) return;
    
    try {
      const { error } = await supabase
        .from("services")
        .insert({ name: newService.trim() });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Service added successfully",
      });
      
      setNewService("");
      fetchServices();
    } catch (error: any) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      
      fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter new service"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={addService} disabled={!newService.trim() || isLoading}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground">No services defined yet.</p>
          ) : (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{service.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteService(service.id)}
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
