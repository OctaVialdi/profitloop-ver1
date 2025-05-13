
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { useCatatanMeetings } from "@/hooks/useCatatanMeetings";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { HistoryDialog } from "@/components/meetings/HistoryDialog";
import { UpdatesDialog } from "@/components/meetings/UpdatesDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MeetingHeader } from "./meetings/components/MeetingHeader";
import { MeetingSearchAndFilters } from "./meetings/components/MeetingSearchAndFilters";
import { NewPointForm } from "./meetings/components/NewPointForm";
import { MeetingPointsTable } from "./meetings/components/MeetingPointsTable";
import { MeetingSummarySection } from "./meetings/components/MeetingSummarySection";

const CatatanMeetings = () => {
  const {
    currentDate,
    filteredMeetingPoints,
    newPoint,
    setNewPoint,
    editDialogOpen,
    setEditDialogOpen,
    historyDialogOpen,
    setHistoryDialogOpen,
    updatesDialogOpen,
    setUpdatesDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedMeeting,
    loading,
    recentUpdates,
    filters,
    setFilters,
    updateCounts,
    searchTerm,
    setSearchTerm,
    notStartedCount,
    onGoingCount,
    completedCount,
    rejectedCount,
    presentedCount,
    updatesCount,
    handleAddPoint,
    handleEditMeeting,
    handleViewHistory,
    handleAddUpdates,
    handleDeletePrompt,
    handleDeleteMeeting,
    handleCreateMeeting,
    handleSaveMeeting,
    handleStatusChange,
    handleRequestByChange,
    handleGenerateMinutes,
    handleUpdateAdded
  } = useCatatanMeetings();

  // Extract unique request_by values for filters
  const uniqueRequestBy = Array.from(
    new Set(filteredMeetingPoints.map(p => p.request_by).filter(Boolean))
  ) as string[];

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="w-full">
      {/* Header section with gradient background and shadow */}
      <MeetingHeader 
        currentDate={currentDate}
        onGenerateMinutes={handleGenerateMinutes}
        onCreateMeeting={handleCreateMeeting}
      />
        
      <div className="max-w-full mx-auto p-6">
        {/* Search and filters section */}
        <MeetingSearchAndFilters
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={setSearchTerm}
          onFiltersChange={handleFilterChange}
          uniqueRequestBy={uniqueRequestBy}
        />
        
        {/* New Discussion Point Input */}
        <NewPointForm
          newPoint={newPoint}
          onNewPointChange={setNewPoint}
          onAddPoint={handleAddPoint}
        />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="w-full lg:w-3/4">
            <MeetingPointsTable
              loading={loading}
              filteredMeetingPoints={filteredMeetingPoints}
              searchTerm={searchTerm}
              updateCounts={updateCounts}
              onStatusChange={handleStatusChange}
              onRequestByChange={handleRequestByChange}
              onEdit={handleEditMeeting}
              onDelete={handleDeletePrompt}
              onAddUpdates={handleAddUpdates}
              uniqueRequestBy={uniqueRequestBy}
            />
          </div>
          
          {/* Sidebar */}
          <MeetingSummarySection
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
          onUpdateAdded={handleUpdateAdded} 
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting point and all associated history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeeting} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
};

export default CatatanMeetings;
