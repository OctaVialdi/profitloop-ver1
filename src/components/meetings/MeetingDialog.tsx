
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
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation } from "lucide-react";

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
    } else {
      // Reset form for new meeting point
      setFormData({
        discussion_point: "",
        request_by: "",
        status: "not-started",
        date: new Date().toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short',
          year: 'numeric'
        })
      });
    }
  }, [meetingPoint, open]);
  
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "on-going":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "presented":
        return <Presentation className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {meetingPoint ? "Edit the meeting details below." : "Add a new meeting point."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discussion_point" className="text-gray-700 dark:text-gray-300">Discussion Point</Label>
            <Input
              id="discussion_point"
              required
              className="border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500"
              value={formData.discussion_point}
              onChange={(e) => handleChange('discussion_point', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request_by" className="text-gray-700 dark:text-gray-300">Request By</Label>
            <Input
              id="request_by"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500"
              value={formData.request_by || ""}
              onChange={(e) => handleChange('request_by', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: any) => handleChange('status', value)}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="not-started">
                  <div className="flex items-center">
                    {getStatusIcon("not-started")}
                    <span className="ml-2">Not Started</span>
                  </div>
                </SelectItem>
                <SelectItem value="on-going">
                  <div className="flex items-center">
                    {getStatusIcon("on-going")}
                    <span className="ml-2">On Going</span>
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    {getStatusIcon("completed")}
                    <span className="ml-2">Completed</span>
                  </div>
                </SelectItem>
                <SelectItem value="rejected">
                  <div className="flex items-center">
                    {getStatusIcon("rejected")}
                    <span className="ml-2">Rejected</span>
                  </div>
                </SelectItem>
                <SelectItem value="presented">
                  <div className="flex items-center">
                    {getStatusIcon("presented")}
                    <span className="ml-2">Presented</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
            <Input
              id="date"
              required
              className="border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {meetingPoint ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
