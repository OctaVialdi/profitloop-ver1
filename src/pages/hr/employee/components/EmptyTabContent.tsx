
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyTabContentProps {
  title: string;
  description: string;
}

export const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title, description }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 mb-4">
        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
      
      <div className="mt-6 flex justify-center gap-3">
        <Button size="sm">Add new</Button>
        <Button size="sm" variant="outline">Import</Button>
        <Button size="sm" variant="outline">Export</Button>
      </div>
    </div>
  );
};
