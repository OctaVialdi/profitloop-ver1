
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
import { Clock, History, Trash2, Edit, MessageSquare } from "lucide-react";
import { createMeetingUpdate, getMeetingUpdates, deleteMeetingUpdate, updateMeetingUpdate } from "@/services/meetingService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [editingUpdate, setEditingUpdate] = useState<MeetingUpdate | null>(null);
  
  useEffect(() => {
    if (open && meetingPoint?.id) {
      // Reset the form when opening the dialog
      setNewUpdate("");
      setEditingUpdate(null);
      // Load existing updates
      loadUpdates();
    }
  }, [open, meetingPoint]);
  
  const loadUpdates = async () => {
    if (!meetingPoint?.id) return;
    
    try {
      const data = await getMeetingUpdates(meetingPoint.id);
      setUpdates(data);
    } catch (error) {
      console.error('Error loading updates:', error);
      toast.error('Failed to load meeting updates');
    }
  };
  
  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) {
      toast.error("Please enter an update");
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingUpdate) {
        // Update existing update
        const updateData = {
          ...editingUpdate,
          title: newUpdate
        };
        
        await updateMeetingUpdate(editingUpdate.id, updateData);
        toast.success("Update modified successfully");
        setEditingUpdate(null);
      } else {
        // Create new update
        const updateData = {
          meeting_point_id: meetingPoint.id,
          status: meetingPoint.status,
          person: meetingPoint.request_by || "Unknown",
          date: formatCurrentDate(),
          title: newUpdate
        };
        
        await createMeetingUpdate(updateData);
        toast.success("Update added successfully");
      }
      
      setNewUpdate("");
      onUpdateAdded();
      loadUpdates(); // Reload the updates after adding a new one
      
    } catch (error) {
      console.error("Error with update:", error);
      toast.error(editingUpdate ? "Failed to modify update" : "Failed to add update");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year} - ${hours}.${minutes}`;
  };

  const handleEditUpdate = (update: MeetingUpdate) => {
    setEditingUpdate(update);
    setNewUpdate(update.title);
  };

  const handleDeleteUpdate = async (update: MeetingUpdate) => {
    try {
      await deleteMeetingUpdate(update.id);
      toast.success("Update deleted successfully");
      loadUpdates(); // Reload updates after deletion
      onUpdateAdded(); // Notify parent component
    } catch (error) {
      console.error("Error deleting update:", error);
      toast.error("Failed to delete update");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Updates for "{meetingPoint?.discussion_point}"
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Add or edit updates for this discussion point
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <Textarea
              placeholder={editingUpdate ? "Edit update..." : "Add new update..."}
              className="min-h-[120px] border-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500"
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
            />
            <div className="flex justify-between">
              {editingUpdate && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingUpdate(null);
                    setNewUpdate("");
                  }}
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
              )}
              <div className={editingUpdate ? "ml-auto" : ""}>
                <Button 
                  onClick={handleAddUpdate} 
                  disabled={loading || !newUpdate.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <History size={16} className="mr-2" />
                  {editingUpdate ? "Save Changes" : "Add Update"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Wrap updates in ScrollArea component for vertical scrolling */}
          <ScrollArea className="h-[300px]">
            {updates && updates.length > 0 ? (
              <div className="space-y-4 pr-4">
                {updates.map((update) => (
                  <div key={update.id} className="p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{update.title}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Clock size={14} className="mr-1" />
                        {update.date}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditUpdate(update)} 
                          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteUpdate(update)} 
                          className="text-red-600 dark:text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <History className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No updates found. Add your first update above.</p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
