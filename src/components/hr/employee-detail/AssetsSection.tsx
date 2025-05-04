
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Plus, Laptop, Monitor, Phone } from "lucide-react";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface AssetsSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

interface EmployeeAsset {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  assignedDate: string;
  status: string;
}

export const AssetsSection: React.FC<AssetsSectionProps> = ({
  employee,
  handleEdit
}) => {
  // This would be replaced with actual assets data from the API
  const [assets, setAssets] = useState<EmployeeAsset[]>([]);
  
  const getAssetIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'laptop': return <Laptop className="h-4 w-4 text-blue-500" />;
      case 'monitor': return <Monitor className="h-4 w-4 text-green-500" />;
      case 'phone': return <Phone className="h-4 w-4 text-purple-500" />;
      default: return <Laptop className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Assets</h2>
          <Button 
            size="sm"
            onClick={() => handleEdit("assets")}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        </div>
        
        {assets.length === 0 ? (
          <EmptyDataDisplay 
            title="There is no data to display"
            description="Your assets data will be displayed here."
            section="assets"
            handleEdit={handleEdit}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Serial Number</div>
              <div className="col-span-2">Assigned Date</div>
              <div className="col-span-1">Status</div>
            </div>
            
            {assets.map(asset => (
              <div key={asset.id} className="grid grid-cols-12 text-sm py-2 hover:bg-gray-50 rounded">
                <div className="col-span-4 flex items-center">
                  {getAssetIcon(asset.type)}
                  <span className="ml-2">{asset.name}</span>
                </div>
                <div className="col-span-2">{asset.type}</div>
                <div className="col-span-3">{asset.serialNumber}</div>
                <div className="col-span-2">{asset.assignedDate}</div>
                <div className="col-span-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    asset.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    asset.status === 'Repair' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
