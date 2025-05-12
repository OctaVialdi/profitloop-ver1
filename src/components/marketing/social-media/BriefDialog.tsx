
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";

interface BriefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brief: string;
  mode: "edit" | "view";
  onSave: (brief: string) => void;
}

export const BriefDialog: React.FC<BriefDialogProps> = ({
  open,
  onOpenChange,
  brief,
  mode,
  onSave,
}) => {
  const [currentBrief, setCurrentBrief] = useState(brief);
  const [googleDocsLink, setGoogleDocsLink] = useState<string | null>(null);

  useEffect(() => {
    setCurrentBrief(brief);
    
    // Extract Google Docs link if present
    const extractLink = (text: string): string | null => {
      const regex = /(https:\/\/docs\.google\.com\/\S+)/;
      const match = text.match(regex);
      return match ? match[1] : null;
    };
    
    setGoogleDocsLink(extractLink(brief));
  }, [brief]);

  const handleSave = () => {
    onSave(currentBrief);
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? "View Brief" : "Edit Brief"}
          </DialogTitle>
        </DialogHeader>
        
        {isViewMode ? (
          <div className="mt-4">
            <div className="prose max-w-none whitespace-pre-wrap">
              {currentBrief}
            </div>
            
            {googleDocsLink && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => window.open(googleDocsLink, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Google Docs
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Textarea
            value={currentBrief}
            onChange={(e) => setCurrentBrief(e.target.value)}
            placeholder="Write your content brief here..."
            className="h-[300px] mt-4"
          />
        )}
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          
          {!isViewMode && (
            <Button onClick={handleSave}>
              Save Brief
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
