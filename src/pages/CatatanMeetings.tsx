
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { HistoryDialog } from "@/components/meetings/HistoryDialog";
import { UpdatesDialog } from "@/components/meetings/UpdatesDialog";
import { MeetingFilters } from "@/components/meetings/MeetingFilters";
import { MeetingPointsTable } from "@/components/meetings/MeetingPointsTable";
import { MeetingSidebar } from "@/components/meetings/MeetingSidebar"; 
import { generateMeetingMinutes } from "@/services/meetingService";
import { MeetingPoint, MeetingStatus } from "@/types/meetings";
import { useMeetingPoints } from "@/hooks/useMeetingPoints";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CatatanMeetings = () => {
  // Use our custom hook for meeting points data and logic
  const {
    meetingPoints,
    recentUpdates,
    updateCounts,
    loading,
    filters,
    setFilters,
    loadData,
    handleAddPoint,
    handleStatusChange,
    handleRequestByChange,
    handleDeleteMeeting,
    handleUpdateMeeting,
    notStartedCount,
    onGoingCount,
    completedCount,
    rejectedCount,
    presentedCount,
    requestByOptions
  } = useMeetingPoints();

  // Local state
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState<boolean>(false);
  const [updatesDialogOpen, setUpdatesDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPoint | null>(null);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
  
  // Event handlers
  const handleEditMeeting = (meeting: MeetingPoint) => {
    setSelectedMeeting(meeting);
    setEditDialogOpen(true);
  };
  
  const handleViewHistory = (meeting: MeetingPoint) => {
    setSelectedMeeting(meeting);
    setHistoryDialogOpen(true);
  };

  const handleAddUpdates = (meeting: MeetingPoint) => {
    setSelectedMeeting(meeting);
    setUpdatesDialogOpen(true);
  };
  
  const handleDeletePrompt = (meeting: MeetingPoint) => {
    setSelectedMeeting(meeting);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (selectedMeeting) {
      const success = await handleDeleteMeeting(selectedMeeting.id);
      if (success) {
        setDeleteDialogOpen(false);
      }
    }
  };
  
  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setEditDialogOpen(true);
  };
  
  const handleSaveMeeting = async (meetingData: Partial<MeetingPoint>) => {
    if (selectedMeeting) {
      // Update existing
      await handleUpdateMeeting(selectedMeeting.id, meetingData);
      setEditDialogOpen(false);
    } else {
      // Create new
      const success = await handleAddPoint(meetingData.discussion_point || "");
      if (success) {
        setEditDialogOpen(false);
      }
    }
  };
  
  const handleGenerateMinutes = async () => {
    const minutes = await generateMeetingMinutes(currentDate);
    if (minutes) {
      toast.success("Meeting minutes downloaded successfully");
    }
  };
  
  const updatesCount = recentUpdates.length;
  
  return (
    <div className="w-full">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center p-6 bg-white border-b w-full sticky top-0 z-10">
          <h1 className="text-2xl font-semibold">{currentDate}</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleGenerateMinutes}
          >
            <Download size={16} />
            Download Minutes
          </Button>
        </div>
        
        <div className="flex flex-1">
          {/* Main content area - 75% */}
          <div className="w-3/4 p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meeting Points</h2>
                <MeetingFilters 
                  filters={filters}
                  onFilterChange={setFilters}
                  requestByOptions={requestByOptions}
                />
              </div>
              
              <MeetingPointsTable 
                meetingPoints={meetingPoints}
                loading={loading}
                updateCounts={updateCounts}
                onStatusChange={handleStatusChange}
                onRequestByChange={handleRequestByChange}
                onEdit={handleEditMeeting}
                onDelete={handleDeletePrompt}
                onViewUpdates={handleAddUpdates}
                onAddPoint={handleAddPoint}
                requestByOptions={requestByOptions}
              />
            </div>
          </div>
          
          {/* Sidebar - 25% */}
          <MeetingSidebar 
            notStartedCount={notStartedCount}
            onGoingCount={onGoingCount}
            completedCount={completedCount}
            rejectedCount={rejectedCount}
            presentedCount={presentedCount}
            updatesCount={updatesCount}
            recentUpdates={recentUpdates}
          />
        </div>
      </div>
      
      {/* Floating action button - made sticky */}
      <div className="fixed bottom-8 right-8 z-30">
        <Button 
          variant="default" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
          onClick={handleCreateMeeting}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Edit Dialog */}
      <MeetingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveMeeting}
        meetingPoint={selectedMeeting || undefined}
        title={selectedMeeting ? "Edit Meeting Point" : "Add Meeting Point"}
      />
      
      {/* History Dialog */}
      {selectedMeeting && (
        <HistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          meetingPoint={selectedMeeting}
        />
      )}

      {/* Updates Dialog */}
      {selectedMeeting && (
        <UpdatesDialog
          open={updatesDialogOpen}
          onOpenChange={setUpdatesDialogOpen}
          meetingPoint={selectedMeeting}
          onUpdateAdded={loadData}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting point and all associated history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
};

export default CatatanMeetings;
