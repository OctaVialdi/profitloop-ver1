
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyDataDisplayProps {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
  section?: string; // Add this prop to fix the type errors
  handleEdit?: (section: string) => void; // Add this prop to fix the type errors
}

export const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({
  title,
  description,
  buttonText,
  onClick,
  section,
  handleEdit
}) => {
  // Use either the onClick prop directly or handleEdit with section if both are provided
  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else if (handleEdit && section) {
      handleEdit(section);
    }
  };

  return (
    <div className="p-6 text-center py-12 border rounded-md">
      <div className="mx-auto w-24 h-24 mb-4">
        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
      
      {(buttonText && onClick) || (handleEdit && section) ? (
        <div className="mt-6">
          <Button size="sm" onClick={handleButtonClick}>
            {buttonText || `Add ${section}`}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
