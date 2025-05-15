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

interface ContentType {
  id: string;
  name: string;
  description: string;
}

export const ContentTypesTab = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const { mutate: createContentType, isLoading: isCreating } = useMutation(
    async () => {
      if (!organization?.id) {
        throw new Error("Organization ID not found");
      }

      const { data, error } = await supabase
        .from('content_types_digital_marketing')
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
        queryClient.invalidateQueries({ queryKey: ['contentTypes'] });
        setName('');
        setDescription('');
        setOpen(false);
        toast("Success", {
          description: "Content type created successfully",
        });
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to create content type",
          variant: "destructive"
        });
      },
    }
  );

  const { data: contentTypes, isLoading, error } = useQuery(
    ['contentTypes'],
    async () => {
      if (!organization?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('content_types_digital_marketing')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) {
        throw error;
      }

      return data as ContentType[];
    }
  );

  const handleCreateContentType = async () => {
    try {
      createContentType();
    } catch (error) {
      toast("Error", {
        description: "Failed to create content type",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Add Content Type</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Content Type</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input 
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
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreateContentType} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="text-red-500">Error: {error.message}</div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">Loading...</TableCell>
            </TableRow>
          )}
          {!isLoading && contentTypes && contentTypes.map((contentType) => (
            <TableRow key={contentType.id}>
              <TableCell>{contentType.name}</TableCell>
              <TableCell>{contentType.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
