
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface FilesSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  employee,
  handleEdit
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Files</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description="Your files will be displayed here."
          section="files"
          handleEdit={handleEdit}
        />
      </div>
    </Card>
  );
};
