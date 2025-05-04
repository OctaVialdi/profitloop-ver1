
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Plus, FileIcon } from "lucide-react";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface FilesSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

interface EmployeeFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  employee,
  handleEdit
}) => {
  // This would be replaced with actual file data from the API
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Files</h2>
          <Button 
            size="sm"
            onClick={() => handleEdit("files")}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Files
          </Button>
        </div>
        
        {files.length === 0 ? (
          <EmptyDataDisplay 
            title="There is no data to display"
            description="Your files will be displayed here."
            section="files"
            handleEdit={handleEdit}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Date</div>
            </div>
            
            {files.map(file => (
              <div key={file.id} className="grid grid-cols-12 text-sm py-2 hover:bg-gray-50 rounded">
                <div className="col-span-5 flex items-center">
                  <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
                  {file.name}
                </div>
                <div className="col-span-2">{file.type}</div>
                <div className="col-span-2">{file.size}</div>
                <div className="col-span-3">{file.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
