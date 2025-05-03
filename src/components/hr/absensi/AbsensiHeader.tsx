
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface AbsensiHeaderProps {
  title: string;
}

export const AbsensiHeader: React.FC<AbsensiHeaderProps> = ({ title }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button variant="outline" size="sm" className="h-7 text-xs flex items-center">
          <Upload className="mr-1 h-3 w-3" />
          Import Data
        </Button>
        <Button variant="default" size="sm" className="h-7 text-xs flex items-center">
          <Download className="mr-1 h-3 w-3" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
