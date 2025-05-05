
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeAsset, assetService } from "@/services/assetService";
import { AlertTriangle } from "lucide-react";

interface DeleteAssetDialogProps {
  asset: EmployeeAsset;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteAssetDialog = ({ asset, isOpen, onClose, onDeleted }: DeleteAssetDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await assetService.deleteAsset(asset.id);
      onDeleted();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Asset</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the asset "{asset.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <span className="font-medium">Asset Name:</span>
                <span>{asset.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Type:</span>
                <span>{asset.asset_type}</span>
              </div>
              {asset.serial_number && (
                <div className="grid grid-cols-2">
                  <span className="font-medium">Serial Number:</span>
                  <span>{asset.serial_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Asset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
