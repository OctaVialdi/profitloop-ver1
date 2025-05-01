
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PageHeaderProps {
  currentDate: string;
  onGenerateMinutes: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ currentDate, onGenerateMinutes }) => {
  return (
    <div className="flex justify-between items-center p-6 bg-white border-b">
      <h1 className="text-2xl font-semibold">{currentDate}</h1>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onGenerateMinutes}
      >
        <Download size={16} />
        Download Minutes
      </Button>
    </div>
  );
};
