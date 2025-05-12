
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";

interface BriefDialogProps {
  isOpen: boolean;
  onClose: () => void;
  briefContent: string;
  onSave: (content: string) => void;
  mode: "edit" | "view";
  title?: string;
}

export const BriefDialog: React.FC<BriefDialogProps> = ({
  isOpen,
  onClose,
  briefContent,
  onSave,
  mode,
  title = "Brief Content",
}) => {
  const [content, setContent] = useState(briefContent || "");
  const [googleDocsLink, setGoogleDocsLink] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Reset content when dialog opens with new briefContent
  useEffect(() => {
    setContent(briefContent || "");
    
    // Extract Google Docs link if it exists
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/\S+)/g;
    const match = briefContent.match(googleDocsRegex);
    setGoogleDocsLink(match ? match[0] : null);
  }, [briefContent, isOpen]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Check for Google Docs links in real-time
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/\S+)/g;
    const match = e.target.value.match(googleDocsRegex);
    setGoogleDocsLink(match ? match[0] : null);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        {showPreview && googleDocsLink ? (
          <div className="h-[400px] w-full border rounded">
            <iframe
              src={`${googleDocsLink}?embedded=true`}
              className="w-full h-full"
              frameBorder="0"
            ></iframe>
          </div>
        ) : (
          <div className="my-4">
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Enter brief content here..."
              className="min-h-[300px] resize-none"
              readOnly={mode === "view"}
              autoFocus={mode === "edit"}
            />
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex items-center">
            {googleDocsLink && (
              <Button
                type="button"
                variant="outline"
                onClick={togglePreview}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {showPreview ? "Show Brief Text" : "Preview Google Doc"}
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {mode === "edit" && (
              <Button type="button" onClick={handleSave}>
                Save Brief
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
