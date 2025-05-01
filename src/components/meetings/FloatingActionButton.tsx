
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-30">
      <Button 
        variant="default" 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 transition-colors"
        onClick={onClick}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};
