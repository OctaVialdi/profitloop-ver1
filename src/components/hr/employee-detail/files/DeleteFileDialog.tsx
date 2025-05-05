
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeFile, fileService } from "@/services/fileService";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface DeleteFileDialogProps {
  file: EmployeeFile;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteFileDialog = ({
  file,
  isOpen,
  onClose,
  onDeleted
}: DeleteFileDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await fileService.deleteEmployeeFile(file.id, file.file_url);
      toast.success("File deleted successfully");
      onDeleted();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center">
            <div className="mr-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800">Are you sure you want to delete this file?</h4>
              <p className="text-sm text-amber-700 mt-1">
                <strong>File name:</strong> {file.name}
              </p>
              <p className="text-sm text-amber-700">
                <strong>File type:</strong> {file.file_type}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
