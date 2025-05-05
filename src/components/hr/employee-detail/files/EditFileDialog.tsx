
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { EmployeeFile, fileService, fileTypes } from "@/services/fileService";
import { toast } from "sonner";
import { FileText } from "lucide-react";

interface EditFileDialogProps {
  file: EmployeeFile;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const EditFileDialog = ({
  file,
  isOpen,
  onClose,
  onSaved
}: EditFileDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState(file.name);
  const [fileType, setFileType] = useState(file.file_type);
  const [description, setDescription] = useState(file.description || "");
  const [status, setStatus] = useState(file.status || "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await fileService.updateEmployeeFile({
        id: file.id,
        name: fileName,
        fileType,
        description: description || null,
        status
      });
      
      toast.success("File updated successfully");
      onSaved();
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Original filename</p>
                <p className="font-medium">{file.name}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="file_name">File Name</Label>
              <Input 
                id="file_name" 
                value={fileName} 
                onChange={(e) => setFileName(e.target.value)} 
                placeholder="Enter file name"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="file_type">File Type</Label>
              <Select value={fileType} onValueChange={setFileType} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter file description"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
