
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@/hooks/useOrganization";
import { createReprimand } from "@/services/reprimandService";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AddReprimandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  employee_id: string;
  reprimand_type: string;
  date: Date;
  details: string;
  escalation_level: number;
}

const reprimandTypes = ["Verbal", "Written", "PIP", "Suspension"];

const AddReprimandDialog: React.FC<AddReprimandDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { organization } = useOrganization();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: {
      reprimand_type: "Verbal",
      date: new Date(),
      escalation_level: 1,
      details: ""
    }
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch employees for dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .eq('organization_id', organization.id)
        .eq('status', 'Active')
        .order('name');
        
      if (error) {
        toast.error("Failed to fetch employees");
        return [];
      }
      
      return data;
    },
    enabled: !!organization?.id
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    if (!organization?.id) {
      toast.error("Organization information not available");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload any attachment files
      const attachments = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `reprimand/${Date.now()}-${file.name}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('reprimand-attachments')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('reprimand-attachments')
            .getPublicUrl(fileName);
            
          attachments.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url: publicUrlData.publicUrl
          });
        }
      }
      
      // Get user/employee information
      const { data: userProfile } = await supabase.auth.getUser();
      
      if (!userProfile?.user?.id) {
        throw new Error("User information not available");
      }
      
      // Get the current user's employee record
      const { data: currentEmployee, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('email', userProfile.user.email)
        .eq('organization_id', organization.id)
        .single();
        
      if (employeeError) {
        console.error("Error getting employee record:", employeeError);
      }

      // Create the reprimand record
      const result = await createReprimand({
        organization_id: organization.id,
        employee_id: data.employee_id,
        reprimand_type: data.reprimand_type,
        date: format(data.date, 'yyyy-MM-dd'),
        details: data.details,
        status: 'Active',
        escalation_level: data.escalation_level,
        evidence_attachments: attachments.length > 0 ? attachments : undefined,
        created_by: currentEmployee?.id
      });

      if (result) {
        reset();
        setFiles([]);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating reprimand:', error);
      toast.error('Failed to create reprimand record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Reprimand</DialogTitle>
          <DialogDescription>
            Create a new reprimand record for an employee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee</Label>
            <Select 
              onValueChange={(value) => setValue('employee_id', value)} 
              defaultValue={watch('employee_id')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee_id && (
              <p className="text-sm text-destructive">Employee is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reprimand_type">Reprimand Type</Label>
            <Select 
              onValueChange={(value) => setValue('reprimand_type', value)}
              defaultValue={watch('reprimand_type')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reprimandTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setValue('date', date);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalation_level">Escalation Level</Label>
            <Select 
              onValueChange={(value) => setValue('escalation_level', parseInt(value))}
              defaultValue={watch('escalation_level').toString()}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea 
              {...register('details')}
              placeholder="Enter reprimand details"
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachments">Evidence Attachments</Label>
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF, images, or video files (max 10MB)
                </p>
                <Input 
                  type="file" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="file-upload" 
                  multiple
                  accept="image/*,.pdf,video/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm truncate max-w-[200px]">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Reprimand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReprimandDialog;
