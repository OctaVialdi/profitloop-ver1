
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContentPillar {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
}

const ContentPillarsTab = () => {
  const { organization } = useOrganization();
  const [pillars, setPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPillars = async () => {
    try {
      if (!organization?.id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('content_pillars_digital_marketing')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setPillars(data || []);
    } catch (error: any) {
      console.error('Error fetching content pillars:', error);
      toast.error('Failed to fetch content pillars');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPillar = async () => {
    try {
      if (!name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (!organization?.id) {
        toast.error('Organization ID is missing');
        return;
      }

      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('content_pillars_digital_marketing')
        .insert({
          name,
          description: description || null,
          organization_id: organization.id,
        })
        .select();

      if (error) throw error;

      toast.success('Content pillar created successfully');
      setName('');
      setDescription('');
      setDialogOpen(false);
      fetchPillars();
    } catch (error: any) {
      console.error('Error adding content pillar:', error);
      toast.error(error.message || 'Failed to create content pillar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePillar = async (id: string) => {
    try {
      if (!organization?.id) return;
      
      setLoading(true);
      const { error } = await supabase
        .from('content_pillars_digital_marketing')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      toast.success('Content pillar deleted successfully');
      fetchPillars();
    } catch (error: any) {
      console.error('Error deleting content pillar:', error);
      toast.error(error.message || 'Failed to delete content pillar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchPillars();
    }
  }, [organization?.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Content Pillars</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Content Pillar</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : pillars.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No content pillars found. Add your first one!
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pillars.map((pillar) => (
                <TableRow key={pillar.id}>
                  <TableCell className="font-medium">{pillar.name}</TableCell>
                  <TableCell>{pillar.description}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePillar(pillar.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Pillar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter pillar name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPillar}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPillarsTab;
