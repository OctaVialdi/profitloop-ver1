
import React from "react";
import { Button } from "@/components/ui/button";

interface KolFormHeaderProps {
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const KolFormHeader: React.FC<KolFormHeaderProps> = ({
  isLoading,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">Add New KOL</h3>
        <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create KOL"}
        </Button>
      </div>
    </div>
  );
};
