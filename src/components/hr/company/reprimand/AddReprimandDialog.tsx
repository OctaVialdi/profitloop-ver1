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
import { CalendarIcon, Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { createAssetImagesBucket, getUploadFileURL } from '@/integrations/supabase/storage';

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

interface FileAttachment {
  name: string;
  size: number;
  file: File;
  url?: string;
}

const AddReprimandDialog: React.FC<AddReprimandDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { organization } = useOrganization();
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newAttachments: FileAttachment[] = files.map(file => ({
      name: file.name,
      size: file.size,
      file: file,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (organizationId: string, employeeId: string, reprimandId: string) => {
    try {
      // Check if bucket exists, if not create it
      await createAssetImagesBucket();
      
      // Upload each attachment
      const uploads = await Promise.all(attachments.map(async (attachment) => {
        const fileExt = attachment.name.split('.').pop();
        const filePath = `${organizationId}/${employeeId}/${reprimandId}/${uuidv4()}.${fileExt}`;
        
        // Upload file to storage
        const { error } = await supabase.storage
          .from('reprimand-attachments')
          .upload(filePath, attachment.file);
          
        if (error) throw error;
        
        // Get public URL
        const url = await getUploadFileURL(filePath, attachment.file);
        
        return {
          name: attachment.name,
          size: attachment.size,
          url
        };
      }));
      
      return uploads;
    } catch (error) {
      console.error('Error uploading attachments:', error);
      throw error;
    }
  };

  const onSubmit = async (data: any) => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    
    try {
      const reprimandId = uuidv4();
      
      // Upload any attachments
      let evidenceAttachments = null;
      if (attachments.length > 0) {
        evidenceAttachments = await uploadAttachments(organization.id, data.employee_id, reprimandId);
      }
      
      // Create the reprimand - removing the id property from the object literal
      await createReprimand({
        organization_id: organization.id,
        employee_id: data.employee_id,
        reprimand_type: data.reprimand_type,
        date: format(data.date, 'yyyy-MM-dd'),
        details: data.details,
        escalation_level: data.escalation_level,
        status: 'Active',
        evidence_attachments: evidenceAttachments,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });
      
      reset();
      setAttachments([]);
      onSuccess();
      onClose();
      toast.success('Reprimand created successfully');
    } catch (error) {
      console.error('Error creating reprimand:', error);
      toast.error('Failed to create reprimand');
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
                    {emp.name}
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

          <div className="space-y-2">
            <Label>Evidence/Attachments</Label>
            <div
              className={`mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-sm
                ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                ${attachments.length > 0 ? 'bg-gray-50' : ''}
              `}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {attachments.length === 0 ? (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">Drag and drop files here or</p>
                  <label htmlFor="file_upload" className="cursor-pointer text-primary hover:underline mt-1">
                    <span>Browse files</span>
                    <input
                      id="file_upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                </>
              ) : (
                <div className="w-full space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-center mt-2">
                    <label htmlFor="add_more_files" className="cursor-pointer text-primary hover:underline text-sm">
                      <span>+ Add more files</span>
                      <input
                        id="add_more_files"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
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
