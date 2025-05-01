
import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeetingPoint, MeetingUpdate, MeetingStatus } from "@/types/meetings";
import { AlertTriangle, CheckCircle, Clock, Presentation, XCircle } from "lucide-react";
import { getMeetingUpdates } from "@/services/meetingService";

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingPoint: MeetingPoint;
}

export const HistoryDialog: React.FC<HistoryDialogProps> = ({ 
  open, 
  onOpenChange, 
  meetingPoint
}) => {
  const [updates, setUpdates] = useState<MeetingUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (open && meetingPoint?.id) {
      loadUpdates();
    }
  }, [open, meetingPoint]);
  
  const loadUpdates = async () => {
    setLoading(true);
    try {
      const data = await getMeetingUpdates(meetingPoint.id);
      // Cast the response data to the MeetingUpdate type
      setUpdates(data.map(update => ({
        ...update,
        status: update.status as MeetingStatus
      })));
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "on-going":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "presented":
        return <Presentation className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-started":
        return "text-gray-600";
      case "on-going":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "presented":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update History</DialogTitle>
          <DialogDescription>
            <div className="line-clamp-2">
              History of updates for: {meetingPoint?.discussion_point}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-y-auto py-2">
          {loading ? (
            <div className="text-center py-4">Loading updates...</div>
          ) : updates.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No update history found.</div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(update.status)}
                    <span className={`font-medium ${getStatusColor(update.status)}`}>
                      Status changed to: {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{update.date}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">By: {update.person}</div>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
