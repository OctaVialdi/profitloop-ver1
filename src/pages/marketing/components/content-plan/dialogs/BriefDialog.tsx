
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface BriefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string | null;
  onSubmit: (content: string) => void;
}

export default function BriefDialog({ open, onOpenChange, content, onSubmit }: BriefDialogProps) {
  const [brief, setBrief] = useState(content || '');
  
  const handleSave = () => {
    onSubmit(brief);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Brief</DialogTitle>
          <DialogDescription>
            Enter the content brief details below. You can also include links.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            value={brief} 
            onChange={e => setBrief(e.target.value)} 
            placeholder="Enter brief content..." 
            className="min-h-[200px]" 
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Brief
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
