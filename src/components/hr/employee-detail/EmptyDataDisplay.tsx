
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyDataDisplayProps {
  title: string;
  description: string;
  section?: string;
  handleEdit?: (section: string) => void;
  actionLabel?: string; // Added this prop
  onAction?: () => void; // Added this prop
}

export const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({
  title,
  description,
  section,
  handleEdit,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Button
        onClick={() => {
          if (onAction) {
            onAction();
          } else if (handleEdit && section) {
            handleEdit(section);
          }
        }}
        variant="outline"
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> {actionLabel || (section ? `Add ${section.charAt(0).toUpperCase() + section.slice(1)} Data` : 'Add')}
      </Button>
    </div>
  );
};
