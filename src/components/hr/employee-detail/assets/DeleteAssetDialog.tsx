
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeAsset, assetService } from "@/services/assetService";

interface DeleteAssetDialogProps {
  asset: EmployeeAsset;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteAssetDialog: React.FC<DeleteAssetDialogProps> = ({
  asset,
  isOpen,
  onClose,
  onDeleted
}) => {
  const handleDelete = async () => {
    const success = await assetService.deleteAsset(asset.id);
    if (success) {
      onDeleted();
    } else {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Asset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the asset "{asset.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
