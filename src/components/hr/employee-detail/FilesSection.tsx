
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { useQuery } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";
import { FilesList } from "./files/FilesList";
import { AddFileDialog } from "./files/AddFileDialog";
import { toast } from "sonner";

interface FilesSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { 
    data: files = [], 
    isLoading,
    error,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['employeeFiles', employee.id],
    queryFn: () => fileService.getEmployeeFiles(employee.id),
    enabled: !!employee.id
  });

  // Log errors if any
  useEffect(() => {
    if (error) {
      console.error("Error fetching employee files:", error);
      toast.error("Failed to load files");
    }
  }, [error]);

  const handleFileUploaded = () => {
    refetchFiles();
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Files</h2>
          <Button 
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add File
          </Button>
        </div>
        
        <FilesList 
          files={files} 
          employeeId={employee.id}
          onFilesUpdated={refetchFiles}
          isLoading={isLoading}
        />

        <AddFileDialog
          employeeId={employee.id}
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onUploaded={handleFileUploaded}
        />
      </div>
    </Card>
  );
};
