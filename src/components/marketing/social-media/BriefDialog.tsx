
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BriefDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  extractGoogleDocsLink
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Brief" : "View Brief"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {mode === "edit" ? (
            <Textarea 
              value={currentBrief} 
              onChange={(e) => setCurrentBrief(e.target.value)}
              placeholder="Enter brief details here..."
              className="min-h-[200px]"
            />
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="whitespace-pre-wrap break-words">
                  {currentBrief}
                </div>
              </ScrollArea>
              
              {extractGoogleDocsLink(currentBrief) && (
                <div className="border rounded-md overflow-hidden mt-4">
                  <iframe 
                    src={`${extractGoogleDocsLink(currentBrief)}?embedded=true`}
                    className="w-full h-[300px]"
                    title="Google Doc"
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          {mode === "edit" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={saveBrief}>Save Brief</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setMode("edit")}>Edit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
