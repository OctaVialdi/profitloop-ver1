
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./PersonalSection";

interface EditableFilesSectionProps {
  employee: Employee;
  handleCancel: () => void;
  handleSave: () => void;
}

export const EditableFilesSection: React.FC<EditableFilesSectionProps> = ({
  employee,
  handleCancel,
  handleSave
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
          handleEdit={() => {}}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </Card>
  );
};
