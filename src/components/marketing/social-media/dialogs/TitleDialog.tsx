
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  saveTitle: () => void;
}

export const TitleDialog: React.FC<TitleDialogProps> = ({
  open,
  onOpenChange,
  currentTitle,
  setCurrentTitle,
  saveTitle
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Content Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <input
              id="title"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Enter complete title"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={saveTitle}>Save Title</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
