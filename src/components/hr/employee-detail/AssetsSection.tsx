
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface AssetsSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const AssetsSection: React.FC<AssetsSectionProps> = ({
  employee,
  handleEdit
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Assets</h2>
        </div>
        <EmptyDataDisplay 
          title="There is no data to display"
          description="Your assets data will be displayed here."
          section="assets"
          handleEdit={handleEdit}
        />
      </div>
    </Card>
  );
};
