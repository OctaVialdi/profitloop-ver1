import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface ContentPillar {
  id: string;
  name: string;
  description: string;
  tone: string;
}

const ContentPillarsTab = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const { mutate: createPillar, isLoading: isCreating } = useMutation(
    async () => {
      if (!organization?.id) {
        throw new Error("Organization ID not found");
      }

      const { data, error } = await supabase
        .from('content_pillars_digital_marketing')
        .insert([{ 
          name, 
          description, 
          tone,
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
        queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
        setOpen(false);
        setName('');
        setDescription('');
        setTone('');
        toast("Success", {
          description: "Content pillar created successfully",
        });
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to create content pillar",
          variant: "destructive"
        });
      },
    }
  );

  const { mutate: deletePillar, isLoading: isDeleting } = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('content_pillars_digital_marketing')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
        toast("Success", {
          description: "Content pillar deleted successfully",
        });
      },
      onError: (error: any) => {
        toast("Error", {
          description: error.message || "Failed to delete content pillar",
          variant: "destructive"
        });
      },
    }
  );

  const { data: contentPillars, isLoading } = useQuery(
    ['contentPillars'],
    async () => {
      if (!organization?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('content_pillars_digital_marketing')
        .select('*')
        .eq('organization_id', organization.id);

      if (error) {
        throw error;
      }

      return data as ContentPillar[];
    },
    {
      enabled: !!organization?.id,
    }
  );

  const handleCreatePillar = async () => {
    createPillar();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-medium">Content Pillars</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Content Pillar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Content Pillar</DialogTitle>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tone" className="text-right">
                  Tone
                </Label>
                <Select onValueChange={setTone}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informative">Informative</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Entertaining">Entertaining</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreatePillar} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && contentPillars?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No content pillars found.</TableCell>
              </TableRow>
            )}
            {!isLoading && contentPillars?.map((pillar) => (
              <TableRow key={pillar.id}>
                <TableCell className="font-medium">{pillar.name}</TableCell>
                <TableCell>{pillar.description}</TableCell>
                <TableCell>{pillar.tone}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost"
                    onClick={() => deletePillar(pillar.id)}
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

export default ContentPillarsTab;
