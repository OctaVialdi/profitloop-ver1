
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeAsset } from "@/services/assetService";
import { EditAssetDialog } from "./EditAssetDialog";
import { AddAssetDialog } from "./AddAssetDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { assetService } from "@/services/assetService";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface AssetsListProps {
  assets: EmployeeAsset[];
  employeeId: string;
  onAssetsUpdated: () => void;
  isLoading?: boolean;
}

export const AssetsList: React.FC<AssetsListProps> = ({
  assets,
  employeeId,
  onAssetsUpdated,
  isLoading = false
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<EmployeeAsset | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleEditAsset = (asset: EmployeeAsset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAsset = async (assetId: string) => {
    const success = await assetService.deleteAsset(assetId);
    if (success) {
      onAssetsUpdated();
    }
    setIsDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const confirmDeleteAsset = (assetId: string) => {
    setAssetToDelete(assetId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddAssetClick = () => {
    setIsAddDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use': return 'bg-blue-100 text-blue-700';
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Maintenance': return 'bg-amber-100 text-amber-700';
      case 'Retired': return 'bg-gray-100 text-gray-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700';
      case 'Good': return 'bg-blue-100 text-blue-700';
      case 'Fair': return 'bg-amber-100 text-amber-700';
      case 'Poor': return 'bg-red-100 text-red-700';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading assets...</p>
      </div>
    );
  }

  if (!assets.length) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Assets Found</h3>
        <p className="text-gray-500 mb-4">This employee has no assigned assets yet.</p>
        <Button onClick={handleAddAssetClick}>Add First Asset</Button>
        
        {isAddDialogOpen && (
          <AddAssetDialog
            employeeId={employeeId}
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSaved={onAssetsUpdated}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="space-y-1 mb-2 md:mb-0 md:w-1/3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className={`${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </Badge>
                  {asset.condition && (
                    <Badge variant="outline" className={`${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {asset.asset_type}
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">{asset.name}</h3>
                {asset.brand && asset.model && (
                  <p className="text-sm text-gray-500">{asset.brand} {asset.model}</p>
                )}
                {asset.serial_number && (
                  <p className="text-xs text-gray-500">S/N: {asset.serial_number}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:w-1/3">
                {asset.assigned_date && (
                  <div>
                    <p className="text-xs text-gray-500">Assigned Date</p>
                    <p className="text-sm">{format(new Date(asset.assigned_date), 'MMM dd, yyyy')}</p>
                  </div>
                )}
                {asset.expected_return_date && (
                  <div>
                    <p className="text-xs text-gray-500">Expected Return</p>
                    <p className="text-sm">{format(new Date(asset.expected_return_date), 'MMM dd, yyyy')}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditAsset(asset)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => confirmDeleteAsset(asset.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
            
            {asset.specifications && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Specifications</p>
                <p className="text-sm">{asset.specifications}</p>
              </div>
            )}
            
            {asset.notes && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm">{asset.notes}</p>
              </div>
            )}

            {asset.asset_image && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Asset Image</p>
                <img 
                  src={asset.asset_image} 
                  alt={asset.name} 
                  className="max-h-44 object-contain rounded-md" 
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={handleAddAssetClick}>Add Another Asset</Button>
      </div>
      
      {isAddDialogOpen && (
        <AddAssetDialog
          employeeId={employeeId}
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSaved={onAssetsUpdated}
        />
      )}
      
      {isEditDialogOpen && selectedAsset && (
        <EditAssetDialog
          asset={selectedAsset}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSaved={onAssetsUpdated}
        />
      )}
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this asset. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => assetToDelete && handleDeleteAsset(assetToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
