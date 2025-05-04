
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyDataDisplayProps {
  title: string;
  description: string;
  section: string;
  handleEdit: (section: string) => void;
}

export const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({
  title,
  description,
  section,
  handleEdit
}) => {
  return (
    <div className="text-center py-8 border rounded-md">
      <div className="mx-auto w-16 h-16 mb-4">
        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
      <Button 
        className="mt-6" 
        onClick={() => handleEdit(section)}
      >
        Add Information
      </Button>
    </div>
  );
};
