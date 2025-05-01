
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeetingPoint } from "@/types/meetings";

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meetingPoint: Partial<MeetingPoint>) => void;
  meetingPoint?: MeetingPoint;
  title: string;
}

export const MeetingDialog: React.FC<MeetingDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  meetingPoint,
  title 
}) => {
  const [formData, setFormData] = useState<Partial<MeetingPoint>>({
    discussion_point: "",
    request_by: "",
    status: "not-started",
    date: new Date().toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  });
  
  useEffect(() => {
    if (meetingPoint) {
      setFormData({
        discussion_point: meetingPoint.discussion_point,
        request_by: meetingPoint.request_by || "",
        status: meetingPoint.status,
        date: meetingPoint.date
      });
    }
  }, [meetingPoint]);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {meetingPoint ? "Edit the meeting details below." : "Add a new meeting point."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discussion_point">Discussion Point</Label>
            <Input
              id="discussion_point"
              required
              value={formData.discussion_point}
              onChange={(e) => handleChange('discussion_point', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request_by">Request By</Label>
            <Input
              id="request_by"
              value={formData.request_by || ""}
              onChange={(e) => handleChange('request_by', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: any) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="on-going">On Going</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="presented">Presented</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              required
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
