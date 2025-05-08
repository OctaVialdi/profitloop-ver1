
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization } from '@/hooks/useOrganization';
import { supabase } from '@/integrations/supabase/client';
import { createReprimand } from '@/services/reprimandService';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AddReprimandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EmployeeOption {
  id: string;
  name: string;
  role: string;
}

const AddReprimandDialog: React.FC<AddReprimandDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { organization } = useOrganization();
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      employee_id: '',
      reprimand_type: 'Verbal',
      date: new Date(),
      details: '',
      escalation_level: 1,
    }
  });
  
  const date = watch('date');
  const selectedEmployee = watch('employee_id');

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!organization?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, role')
          .eq('organization_id', organization.id)
          .eq('status', 'Active')
          .order('name');
          
        if (error) throw error;
        
        setEmployees(data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetchEmployees();
  }, [organization?.id]);

  const onSubmit = async (data: any) => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    
    try {
      await createReprimand({
        organization_id: organization.id,
        employee_id: data.employee_id,
        reprimand_type: data.reprimand_type,
        date: format(data.date, 'yyyy-MM-dd'),
        details: data.details,
        escalation_level: data.escalation_level,
        status: 'Active',
        created_by: supabase.auth.getUser().then(({ data }) => data.user?.id) as unknown as string
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating reprimand:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Reprimand</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee</Label>
            <Select 
              value={selectedEmployee} 
              onValueChange={(value) => setValue('employee_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee_id && (
              <p className="text-sm text-red-600">Employee is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reprimand_type">Reprimand Type</Label>
            <Select 
              defaultValue="Verbal"
              onValueChange={(value) => setValue('reprimand_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verbal">Verbal</SelectItem>
                <SelectItem value="Written">Written</SelectItem>
                <SelectItem value="PIP">Performance Improvement Plan</SelectItem>
                <SelectItem value="Final Warning">Final Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setValue('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="escalation_level">Escalation Level</Label>
            <Select 
              defaultValue="1"
              onValueChange={(value) => setValue('escalation_level', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea 
              id="details" 
              placeholder="Enter details about the reprimand"
              {...register('details')}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Reprimand'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReprimandDialog;
