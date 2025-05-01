import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History, Download, Plus } from "lucide-react";
import { MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";
import { MeetingStatusBadge } from "@/components/meetings/MeetingStatusBadge";
import { MeetingActionButton } from "@/components/meetings/MeetingActionButton";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { HistoryDialog } from "@/components/meetings/HistoryDialog";
import { UpdatesDialog } from "@/components/meetings/UpdatesDialog";
import { VirtualizedMeetingTable } from "@/components/meetings/VirtualizedMeetingTable";
import { 
  getMeetingPoints, 
  getMeetingUpdates, 
  createMeetingPoint, 
  updateMeetingPoint, 
  deleteMeetingPoint,
  generateMeetingMinutes
} from "@/services/meetingService";
import { 
  MeetingPoint, 
  MeetingUpdate, 
  MeetingPointFilters, 
  MeetingStatus,
  MeetingSummaryStatus
} from "@/types/meetings";
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
  const { organization } = useOrganization();
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [newPoint, setNewPoint] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState<boolean>(false);
  const [updatesDialogOpen, setUpdatesDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPoint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentUpdates, setRecentUpdates] = useState<MeetingUpdate[]>([]);
  const [filters, setFilters] = useState<MeetingPointFilters>({
    status: 'all',
    requestBy: 'all',
    timeRange: 'all'
  });
  const [updateCounts, setUpdateCounts] = useState<Record<string, number>>({});
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
  
  // Get unique request by values for dropdown
  const requestByOptions = Array.from(
    new Set(meetingPoints.map(p => p.request_by).filter(Boolean))
  ) as string[];
  
  useEffect(() => {
    if (organization) {
      loadData();
    }
  }, [organization, filters]);
  
  const loadData = async () => {
    setLoading(true);
    const points = await getMeetingPoints(filters);
    setMeetingPoints(points);
    
    // Load recent updates
    const updates = await getMeetingUpdates();
    setRecentUpdates(updates.slice(0, 5)); // Get only the 5 most recent updates
    
    // Calculate update counts for each meeting point
    const counts: Record<string, number> = {};
    points.forEach(point => {
      const pointUpdates = updates.filter(u => u.meeting_point_id === point.id);
      counts[point.id] = pointUpdates.length;
    });
    setUpdateCounts(counts);
    
    setLoading(false);
  };
  
  const handleAddPoint = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPoint.trim() !== "") {
      const newMeetingPoint = {
        date: new Date().toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short',
          year: 'numeric'
        }),
        discussion_point: newPoint,
        request_by: "",
        status: "not-started" as MeetingStatus
      };
      
      const result = await createMeetingPoint(newMeetingPoint);
      if (result) {
        setNewPoint("");
        loadData();
      }
    }
  };
  
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
  
  const handleDeleteMeeting = async () => {
    if (selectedMeeting) {
      const success = await deleteMeetingPoint(selectedMeeting.id);
      if (success) {
        setDeleteDialogOpen(false);
        loadData();
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
      const updated = await updateMeetingPoint(selectedMeeting.id, meetingData);
      if (updated) {
        loadData();
      }
    } else {
      // Create new
      const created = await createMeetingPoint(meetingData as Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>);
      if (created) {
        loadData();
      }
    }
  };
  
  const handleStatusChange = async (meetingId: string, newStatus: MeetingStatus) => {
    const meeting = meetingPoints.find(m => m.id === meetingId);
    if (meeting) {
      const updated = await updateMeetingPoint(meetingId, { status: newStatus });
      if (updated) {
        loadData();
      }
    }
  };
  
  const handleRequestByChange = async (meetingId: string, requestBy: string) => {
    const meeting = meetingPoints.find(m => m.id === meetingId);
    if (meeting) {
      const updated = await updateMeetingPoint(meetingId, { request_by: requestBy });
      if (updated) {
        loadData();
      }
    }
  };
  
  const handleGenerateMinutes = async () => {
    const minutes = await generateMeetingMinutes(currentDate);
    if (minutes) {
      // In a real app, this would generate a downloadable document
      toast.success("Meeting minutes downloaded successfully");
    }
  };
  
  // Count meeting points by status
  const notStartedCount = meetingPoints.filter(point => point.status === "not-started").length;
  const onGoingCount = meetingPoints.filter(point => point.status === "on-going").length;
  const completedCount = meetingPoints.filter(point => point.status === "completed").length;
  const rejectedCount = meetingPoints.filter(point => point.status === "rejected").length;
  const presentedCount = meetingPoints.filter(point => point.status === "presented").length;
  const updatesCount = recentUpdates.length;
  
  // Add the handleUpdateAdded function to reload data after an update is added
  const handleUpdateAdded = () => {
    loadData();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center p-6 bg-white border-b">
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
                <div className="flex space-x-2">
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="on-going">On Going</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="presented">Presented</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.requestBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, requestBy: value }))}
                  >
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Request By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Request By</SelectItem>
                      {requestByOptions.map((person) => (
                        <SelectItem key={person} value={person}>
                          {person}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.timeRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}
                  >
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <VirtualizedMeetingTable
                meetingPoints={meetingPoints}
                loading={loading}
                updateCounts={updateCounts}
                onStatusChange={handleStatusChange}
                onRequestByChange={handleRequestByChange}
                onEditMeeting={handleEditMeeting}
                onDeletePrompt={handleDeletePrompt}
                onAddUpdates={handleAddUpdates}
                onNewPointChange={(value) => setNewPoint(value)}
                onNewPointKeyDown={handleAddPoint}
                newPoint={newPoint}
                requestByOptions={requestByOptions}
              />
            </div>
          </div>
          
          {/* Sidebar - 25% */}
          <div className="w-1/4 bg-white p-6 border-l">
            <h2 className="text-xl font-semibold mb-6">Meeting Summary</h2>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Today's Points</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MeetingSummaryCard 
                    status="not-started" 
                    count={notStartedCount} 
                    icon={AlertTriangle} 
                    label="Not Started" 
                  />
                  <MeetingSummaryCard 
                    status="on-going" 
                    count={onGoingCount} 
                    icon={Clock} 
                    label="On Going" 
                  />
                  <MeetingSummaryCard 
                    status="completed" 
                    count={completedCount} 
                    icon={CheckCircle} 
                    label="Completed" 
                  />
                  <MeetingSummaryCard 
                    status="rejected" 
                    count={rejectedCount} 
                    icon={XCircle} 
                    label="Rejected" 
                  />
                  <MeetingSummaryCard 
                    status="presented" 
                    count={presentedCount} 
                    icon={Presentation} 
                    label="Presented" 
                  />
                  <MeetingSummaryCard 
                    status={"updates" as MeetingSummaryStatus} 
                    count={updatesCount} 
                    icon={History} 
                    label="Updates" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <h3 className="text-lg font-medium mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {recentUpdates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent updates.</p>
              ) : (
                recentUpdates.map((update) => (
                  <MeetingUpdateItem
                    key={update.id}
                    title={update.title}
                    status={update.status}
                    person={update.person}
                    date={update.date}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-8 right-8">
        <Button 
          variant="default" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
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
            <AlertDialogAction onClick={handleDeleteMeeting}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
};

export default CatatanMeetings;
