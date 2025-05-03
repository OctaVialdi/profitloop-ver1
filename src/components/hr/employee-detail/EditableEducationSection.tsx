
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./PersonalSection";

interface EditableEducationSectionProps {
  employee: Employee;
  handleCancel: () => void;
  handleSave: () => void;
}

export const EditableEducationSection: React.FC<EditableEducationSectionProps> = ({
  employee,
  handleCancel,
  handleSave
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description="Your education data will be displayed here."
          section="education"
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
