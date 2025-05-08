
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
import { AlertTriangle, CheckCircle, Clock, Presentation, XCircle, History } from "lucide-react";
import { getMeetingUpdates } from "@/services/meetingService";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
      case "on-going":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
      case "presented":
        return <Presentation className="w-4 h-4 text-purple-600 dark:text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-started":
        return "text-amber-700 dark:text-amber-500";
      case "on-going":
        return "text-blue-700 dark:text-blue-500";
      case "completed":
        return "text-green-700 dark:text-green-500";
      case "rejected":
        return "text-red-700 dark:text-red-500";
      case "presented":
        return "text-purple-700 dark:text-purple-500";
      default:
        return "text-amber-700 dark:text-amber-500";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Update History</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            <div className="line-clamp-2">
              History of updates for: <span className="font-medium">{meetingPoint?.discussion_point}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4 pr-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="mt-2 text-gray-500">Loading updates...</div>
                </div>
              ) : updates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <History className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No update history found.</p>
                </div>
              ) : (
                updates.map((update) => (
                  <div key={update.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md p-2 -mx-2 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(update.status)}
                        <span className={`font-medium ${getStatusColor(update.status)}`}>
                          Status changed to: {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{update.date}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-6">By: <span className="font-medium">{update.person}</span></div>
                    {update.title && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border-l-2 border-blue-400">
                        {update.title}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
