
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
  inputType?: "text" | "url";
}

export const LinkDialog: React.FC<LinkDialogProps> = ({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  onSave,
  placeholder = "Enter value",
  inputType = "text"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <input
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
