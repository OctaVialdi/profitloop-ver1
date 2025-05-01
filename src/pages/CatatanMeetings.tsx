
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useMeetingPoints } from "@/hooks/useMeetingPoints";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { HistoryDialog } from "@/components/meetings/HistoryDialog";
import { UpdatesDialog } from "@/components/meetings/UpdatesDialog";
import { MeetingTableSection } from "@/components/meetings/MeetingTableSection";
import { MeetingSummarySection } from "@/components/meetings/MeetingSummarySection";
import { RecentUpdatesSection } from "@/components/meetings/RecentUpdatesSection";
import { FloatingActionButton } from "@/components/meetings/FloatingActionButton";
import { PageHeader } from "@/components/meetings/PageHeader";
import { MeetingPoint } from "@/types/meetings";
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
  const {
    meetingPoints,
    recentUpdates,
    newPoint,
    loading,
    updateCounts,
    filters,
    requestByOptions,
    currentDate,
    notStartedCount,
    onGoingCount,
    completedCount,
    rejectedCount,
    presentedCount,
    updatesCount,
    setFilters,
    handleNewPointChange,
    handleAddPoint,
    handleStatusChange,
    handleRequestByChange,
    handleSaveMeeting,
    handleDeleteMeeting,
    handleGenerateMinutes,
    loadData
  } = useMeetingPoints();

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState<boolean>(false);
  const [updatesDialogOpen, setUpdatesDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPoint | null>(null);
  
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
  
  const handleDeleteMeetingConfirm = async () => {
    if (selectedMeeting) {
      await handleDeleteMeeting(selectedMeeting.id);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setEditDialogOpen(true);
  };
  
  const handleSaveMeetingData = async (meetingData: Partial<MeetingPoint>) => {
    await handleSaveMeeting(meetingData, selectedMeeting);
    setEditDialogOpen(false);
  };
  
  const handleUpdateAdded = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-full mx-auto">
        <PageHeader 
          currentDate={currentDate}
          onGenerateMinutes={handleGenerateMinutes}
        />
        
        <div className="flex flex-1">
          {/* Main content area - 75% */}
          <div className="w-3/4 p-6 overflow-hidden">
            <MeetingTableSection 
              meetingPoints={meetingPoints}
              loading={loading}
              updateCounts={updateCounts}
              filters={filters}
              requestByOptions={requestByOptions}
              newPoint={newPoint}
              onFiltersChange={setFilters}
              onStatusChange={handleStatusChange}
              onRequestByChange={handleRequestByChange}
              onEditMeeting={handleEditMeeting}
              onDeletePrompt={handleDeletePrompt}
              onAddUpdates={handleAddUpdates}
              onNewPointChange={handleNewPointChange}
              onNewPointKeyDown={handleAddPoint}
            />
          </div>
          
          {/* Sidebar - 25% */}
          <div className="w-1/4 bg-white p-6 border-l">
            <h2 className="text-xl font-semibold mb-6">Meeting Summary</h2>
            
            <MeetingSummarySection 
              notStartedCount={notStartedCount}
              onGoingCount={onGoingCount}
              completedCount={completedCount}
              rejectedCount={rejectedCount}
              presentedCount={presentedCount}
              updatesCount={updatesCount}
            />
            
            <RecentUpdatesSection recentUpdates={recentUpdates} />
          </div>
        </div>
      </div>
      
      <FloatingActionButton onClick={handleCreateMeeting} />
      
      {/* Edit Dialog */}
      <MeetingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveMeetingData}
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
          onUpdateAdded={handleUpdateAdded}
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
            <AlertDialogAction onClick={handleDeleteMeetingConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
};

export default CatatanMeetings;
