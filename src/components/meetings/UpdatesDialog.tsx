
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MeetingPoint, MeetingUpdate } from "@/types/meetings";
import { Clock, History, Trash2, Edit } from "lucide-react";
import { createMeetingUpdate } from "@/services/meetingService";
import { toast } from "sonner";

interface UpdatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingPoint: MeetingPoint;
  onUpdateAdded: () => void;
}

export const UpdatesDialog: React.FC<UpdatesDialogProps> = ({ 
  open, 
  onOpenChange, 
  meetingPoint,
  onUpdateAdded
}) => {
  const [updates, setUpdates] = useState<MeetingUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (open && meetingPoint?.id) {
      // Reset the form when opening the dialog
      setNewUpdate("");
    }
  }, [open, meetingPoint]);
  
  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) {
      toast.error("Please enter an update");
      return;
    }
    
    setLoading(true);
    
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()} - ${currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      
      const updateData = {
        meeting_point_id: meetingPoint.id,
        status: meetingPoint.status,
        person: meetingPoint.request_by || "Unknown",
        date: formattedDate,
        title: newUpdate
      };
      
      await createMeetingUpdate(updateData);
      
      toast.success("Update added successfully");
      setNewUpdate("");
      onUpdateAdded();
      
    } catch (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <History size={20} className="text-blue-500" />
            <DialogTitle>Updates for "{meetingPoint?.discussion_point}"</DialogTitle>
          </div>
          <DialogDescription>
            Add or view updates for this discussion point
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Add new update..."
              className="min-h-[120px] border-blue-200 focus:border-blue-400"
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddUpdate} 
                disabled={loading || !newUpdate.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <History size={20} className="mr-2" />
                Add Update
              </Button>
            </div>
          </div>
          
          {updates && updates.length > 0 && (
            <div className="space-y-4 mt-6">
              {updates.map((update) => (
                <div key={update.id} className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">{update.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      {update.date}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
