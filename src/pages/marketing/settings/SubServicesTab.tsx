import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export function SubServicesTab() {
  const [subServices, setSubServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newSubService, setNewSubService] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubServices();
    fetchServices();
  }, []);

  const fetchSubServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sub_services")
        .select(`
          *,
          service:service_id(id, name)
        `)
        .order("name");
      
      if (error) throw error;
      setSubServices(data || []);
    } catch (error: any) {
      console.error("Error fetching sub services:", error);
      toast("Error", {
        description: "Failed to load sub services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
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
    }
  };

  const addSubService = async () => {
    if (!newSubService.trim() || !selectedServiceId) return;
    
    try {
      const { error } = await supabase
        .from("sub_services")
        .insert({ name: newSubService.trim(), service_id: selectedServiceId });
      
      if (error) throw error;
      
      toast("Success", {
        description: "Sub service added successfully",
      });
      
      setNewSubService("");
      setSelectedServiceId(null);
      fetchSubServices();
    } catch (error: any) {
      console.error("Error adding sub service:", error);
      toast("Error", {
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
      
      toast("Success", {
        description: "Sub service deleted successfully",
      });
      
      fetchSubServices();
    } catch (error: any) {
      console.error("Error deleting sub service:", error);
      toast("Error", {
        description: "Failed to delete sub service",
        variant: "destructive",
      });
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={selectedServiceId || "none"}
          onValueChange={(value) => setSelectedServiceId(value === "none" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select a service</SelectItem>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Enter new sub service"
            value={newSubService}
            onChange={(e) => setNewSubService(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={addSubService} 
            disabled={!newSubService.trim() || !selectedServiceId || isLoading}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {subServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sub services defined yet.</p>
          ) : (
            <ul className="space-y-2">
              {subServices.map((subService) => (
                <li key={subService.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span>{subService.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({getServiceName(subService.service_id)})
                    </span>
                  </div>
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
