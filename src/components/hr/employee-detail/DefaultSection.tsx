
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";

interface DefaultSectionProps {
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const DefaultSection: React.FC<DefaultSectionProps> = ({
  activeTab,
  handleEdit
}) => {
  const title = activeTab.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <Card>
      <div className="p-6 text-center py-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="mx-auto w-24 h-24 mb-4">
          <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium">This section is under development</h3>
        <p className="text-gray-500 mt-2">We're working hard to bring this feature to you soon.</p>
        <div className="mt-6">
          <Button onClick={() => handleEdit(activeTab)}>Setup</Button>
        </div>
      </div>
    </Card>
  );
};
