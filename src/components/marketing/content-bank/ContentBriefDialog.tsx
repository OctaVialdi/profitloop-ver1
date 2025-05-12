
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ContentBriefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  briefContent: string;
  onSave: (content: string) => void;
}

export function ContentBriefDialog({
  open,
  onOpenChange,
  briefContent,
  onSave
}: ContentBriefDialogProps) {
  const [content, setContent] = useState(briefContent);
  
  const handleSave = () => {
    onSave(content);
    onOpenChange(false);
  };
  
  const extractLinkFromBrief = (brief: string): string | null => {
    const googleDocsRegex = /https:\/\/docs\.google\.com\/\S+/;
    const match = brief.match(googleDocsRegex);
    return match ? match[0] : null;
  };
  
  const hasGoogleDocsLink = extractLinkFromBrief(content) !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Content Brief</DialogTitle>
          <DialogDescription>
            Enter details for this content. If you include a Google Docs link, it will be automatically detected.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter brief details or paste a Google Docs link"
            className="min-h-[200px]"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
