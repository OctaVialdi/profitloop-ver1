
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface JobPosition {
  id: string;
  title: string;
}

interface GenerateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateLink: (positionId: string, expirationDays: string) => Promise<void>;
  isLoading: boolean;
  jobPositions: JobPosition[];
  defaultPositionId?: string;
}

export default function GenerateLinkDialog({ 
  open, 
  onOpenChange, 
  onGenerateLink,
  isLoading,
  jobPositions,
  defaultPositionId
}: GenerateLinkDialogProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>(defaultPositionId || "");
  const [expirationPeriod, setExpirationPeriod] = useState<string>("30");

  const handleSubmit = () => {
    onGenerateLink(selectedPosition, expirationPeriod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invitation Link</DialogTitle>
          <DialogDescription>
            Create a new invitation link for candidates to apply
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="position">Job Position</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger id="position">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.length > 0 ? (
                  jobPositions.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-positions" disabled>
                    No active positions found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {jobPositions.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                You need to create job positions first.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry">Link Expiration</Label>
            <Select value={expirationPeriod} onValueChange={setExpirationPeriod}>
              <SelectTrigger id="expiry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="15">15 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || jobPositions.length === 0}
          >
            {isLoading ? "Generating..." : "Generate Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
