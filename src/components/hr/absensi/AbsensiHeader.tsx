
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface AbsensiHeaderProps {
  title: string;
}

export const AbsensiHeader: React.FC<AbsensiHeaderProps> = ({ title }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button variant="outline" size="sm" className="flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
        <Button variant="default" size="sm" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
