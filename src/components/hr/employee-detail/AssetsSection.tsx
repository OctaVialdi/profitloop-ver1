
import React from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AssetsList } from "./assets/AssetsList";
import { assetService } from "@/services/assetService";
import { toast } from "sonner";

interface AssetsSectionProps {
  employee: Employee;
  handleEdit: (section: string) => void;
}

export const AssetsSection: React.FC<AssetsSectionProps> = ({
  employee,
  handleEdit
}) => {
  const { 
    data: assets = [], 
    isLoading,
    error,
    refetch: refetchAssets
  } = useQuery({
    queryKey: ['employeeAssets', employee.id],
    queryFn: () => assetService.getEmployeeAssets(employee.id),
    enabled: !!employee.id
  });

  // Log errors if any
  React.useEffect(() => {
    if (error) {
      console.error("Error fetching employee assets:", error);
      toast.error("Failed to load assets");
    }
  }, [error]);

  const handleAssetsUpdated = () => {
    refetchAssets();
  };

  const handleAddAssetClick = () => {
    // This will be handled by the AssetsList component
    // which will show the AddAssetDialog
    handleEdit("assets");
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Assets</h2>
          <Button 
            size="sm"
            onClick={handleAddAssetClick}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        </div>
        
        <AssetsList
          assets={assets}
          employeeId={employee.id}
          onAssetsUpdated={handleAssetsUpdated}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};
