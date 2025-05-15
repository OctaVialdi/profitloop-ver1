import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Service {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
}

const ServicesTab = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const { mutate: createService, isLoading: isCreating } = useMutation(
    async () => {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { data, error } = await supabase
        .from('services_digital_marketing')
        .insert([{ 
          name, 
          description, 
          organization_id: organization.id 
        }])
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        toast("Success", {
          description: "Service created successfully",
        });
        setOpen(false);
        setName('');
        setDescription('');
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to create service",
          variant: "destructive"
        });
      },
    }
  );

  const { mutate: updateService, isLoading: isUpdating } = useMutation(
    async (updatedService: Service) => {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { data, error } = await supabase
        .from('services_digital_marketing')
        .update({ 
          name: updatedService.name, 
          description: updatedService.description 
        })
        .eq('id', updatedService.id)
        .eq('organization_id', organization.id)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        toast("Success", {
          description: "Service updated successfully",
        });
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to update service",
          variant: "destructive"
        });
      },
    }
  );

  const { mutate: deleteService, isLoading: isDeleting } = useMutation(
    async (id: string) => {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { error } = await supabase
        .from('services_digital_marketing')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        toast("Success", {
          description: "Service deleted successfully",
        });
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to delete service",
          variant: "destructive"
        });
      },
    }
  );

  const { data: services, isLoading, error } = useQueryClient().getQueryData(['services']) as { data: Service[] | undefined, isLoading: boolean, error: any } || { data: undefined, isLoading: false, error: undefined };

  const fetchServices = async () => {
    if (!organization?.id) {
      console.log('Organization ID not found');
      return;
    }

    const { data, error } = await supabase
      .from('services_digital_marketing')
      .select('*')
      .eq('organization_id', organization.id);

    if (error) {
      console.error('Error fetching services:', error);
      return;
    }

    queryClient.setQueryData(['services'], data);
  };

  React.useEffect(() => {
    fetchServices();
  }, [organization?.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreateService = async () => {
    try {
      await createService();
    } catch (error) {
      toast("Error", {
        description: "Failed to create service",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Service</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateService} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services && services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const newName = prompt("Enter new name", service.name);
                      const newDescription = prompt("Enter new description", service.description);
                      if (newName && newDescription) {
                        updateService({ ...service, name: newName, description: newDescription });
                      }
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this service?")) {
                        deleteService(service.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServicesTab;
