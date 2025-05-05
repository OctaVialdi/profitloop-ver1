
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
import { Upload, X } from "lucide-react";
import { fileService, fileTypes } from "@/services/fileService";
import { toast } from "sonner";

interface AddFileDialogProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export const AddFileDialog = ({
  employeeId,
  isOpen,
  onClose,
  onUploaded
}: AddFileDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // If no file name has been entered, use the file name
      if (!fileName) {
        setFileName(droppedFile.name.split('.')[0]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // If no file name has been entered, use the file name
      if (!fileName) {
        setFileName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!fileName) {
      toast.error("Please enter a file name");
      return;
    }
    
    if (!fileType) {
      toast.error("Please select a file type");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await fileService.uploadEmployeeFile({
        employeeId,
        name: fileName,
        fileType,
        description,
        file
      });
      
      toast.success("File uploaded successfully");
      onUploaded();
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New File</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
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
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter file description"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Upload File</Label>
              <div
                className={`mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-sm
                  ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                  ${file ? 'bg-gray-50' : ''}
                `}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {!file ? (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">Drag and drop a file here or</p>
                    <label htmlFor="file_upload" className="cursor-pointer text-primary hover:underline mt-1">
                      <span>Browse files</span>
                      <input
                        id="file_upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
