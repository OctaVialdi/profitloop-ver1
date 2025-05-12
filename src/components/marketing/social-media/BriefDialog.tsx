
import React from "react";
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
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentBrief: string;
  setCurrentBrief: (brief: string) => void;
  mode: "edit" | "view";
  setMode: (mode: "edit" | "view") => void;
  saveBrief: () => void;
  extractGoogleDocsLink: (text: string) => string | null;
}

export const BriefDialog: React.FC<BriefDialogProps> = ({
  isOpen,
  onOpenChange,
  currentBrief,
  setCurrentBrief,
  mode,
  setMode,
  saveBrief,
  extractGoogleDocsLink,
}) => {
  const isViewMode = mode === "view";
  const googleDocsLink = extractGoogleDocsLink(currentBrief);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? "View Brief" : "Edit Brief"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isViewMode ? (
            <div className="whitespace-pre-wrap text-sm">
              {currentBrief}
              {googleDocsLink && (
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={googleDocsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    Open in Google Docs
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Textarea
              value={currentBrief}
              onChange={(e) => setCurrentBrief(e.target.value)}
              placeholder="Enter the brief details for this content..."
              rows={10}
              className="resize-none"
            />
          )}
        </div>
        <DialogFooter>
          {isViewMode ? (
            <Button
              type="button"
              onClick={() => setMode("edit")}
            >
              Edit Brief
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveBrief}
              >
                Save Brief
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
