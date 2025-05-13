
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string | null;
  onSubmit: (content: string) => void;
}

export default function TitleDialog({ open, onOpenChange, content, onSubmit }: TitleDialogProps) {
  const [title, setTitle] = useState(content || '');
  
  const handleSave = () => {
    onSubmit(title);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
          <DialogDescription>
            Enter the content title below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter content title..." 
            className="min-h-[120px]" 
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Title
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
