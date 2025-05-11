import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History, Download, Edit, Trash2, Plus, Search, Calendar, Filter } from "lucide-react";
import { MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";
import { MeetingStatusBadge } from "@/components/meetings/MeetingStatusBadge";
import { MeetingActionButton } from "@/components/meetings/MeetingActionButton";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { HistoryDialog } from "@/components/meetings/HistoryDialog";
import { UpdatesDialog } from "@/components/meetings/UpdatesDialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMeetingPoints, getMeetingUpdates, createMeetingPoint, updateMeetingPoint, deleteMeetingPoint, generateMeetingMinutes, formatCurrentDate } from "@/services/meetingService";
import { MeetingPoint, MeetingUpdate, MeetingPointFilters, MeetingStatus, MeetingSummaryStatus } from "@/types/meetings";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
const CatatanMeetings = () => {
  const {
    organization
  } = useOrganization();
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
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
  const handleAddPoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPoint.trim() !== "") {
      // Date will be empty at first and added during create by the backend
      const newMeetingPoint = {
        date: "",
        discussion_point: newPoint,
        request_by: "",
        status: "not-started" as MeetingStatus
      };
      const result = await createMeetingPoint(newMeetingPoint);
      if (result) {
        setNewPoint("");
        toast.success("New discussion point added successfully");
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
        toast.success("Meeting point deleted successfully");
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
        toast.success("Meeting point updated successfully");
        loadData();
      }
    } else {
      // Create new
      const created = await createMeetingPoint(meetingData as Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>);
      if (created) {
        toast.success("New meeting point created successfully");
        loadData();
      }
    }
  };
  const handleStatusChange = async (meetingId: string, newStatus: MeetingStatus) => {
    const meeting = meetingPoints.find(m => m.id === meetingId);
    if (meeting) {
      const updated = await updateMeetingPoint(meetingId, {
        status: newStatus
      });
      if (updated) {
        toast.success(`Status updated to ${newStatus}`);
        loadData();
      }
    }
  };
  const handleRequestByChange = async (meetingId: string, requestBy: string) => {
    const meeting = meetingPoints.find(m => m.id === meetingId);
    if (meeting) {
      const updated = await updateMeetingPoint(meetingId, {
        request_by: requestBy
      });
      if (updated) {
        toast.success(`Request by updated to ${requestBy}`);
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

  // Filter meeting points based on search term
  const filteredMeetingPoints = meetingPoints.filter(point => point.discussion_point.toLowerCase().includes(searchTerm.toLowerCase()) || point.request_by && point.request_by.toLowerCase().includes(searchTerm.toLowerCase()));

  // Add the handleUpdateAdded function to reload data after an update is added
  const handleUpdateAdded = () => {
    loadData();
  };
  return <div className="w-full">
      {/* Header section with gradient background and shadow */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b shadow-sm">
        <div className="max-w-full mx-auto p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{currentDate}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900 transition-all" onClick={handleGenerateMinutes}>
              <Download size={16} />
              <span>Download Minutes</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 transition-all" onClick={handleCreateMeeting}>
              <Plus size={16} className="mr-2" />
              <span>New Meeting Point</span>
            </Button>
          </div>
        </div>
      </div>
        
      <div className="max-w-full mx-auto p-6">
        {/* Search and filters section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search discussion points..." className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status} onValueChange={value => setFilters(prev => ({
              ...prev,
              status: value
            }))}>
                <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
              
              <Select value={filters.requestBy} onValueChange={value => setFilters(prev => ({
              ...prev,
              requestBy: value
            }))}>
                <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="All Request By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Request By</SelectItem>
                  {/* Dynamically generate list from unique requestBy values */}
                  {Array.from(new Set(meetingPoints.map(p => p.request_by))).filter(Boolean).map(person => <SelectItem key={person} value={person as string}>
                      {person}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={filters.timeRange} onValueChange={value => setFilters(prev => ({
              ...prev,
              timeRange: value
            }))}>
                <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
        </div>
        
        {/* New Discussion Point Input */}
        <form onSubmit={handleAddPoint} className="flex items-center mb-6">
          <div className="relative flex-grow">
            <Input type="text" placeholder="Type a new discussion point and press Enter..." className="pr-24 border-blue-200 dark:border-blue-800 focus:border-blue-400 transition-all" value={newPoint} onChange={e => setNewPoint(e.target.value)} />
            <Button type="submit" className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 transition-all" size="sm" disabled={!newPoint.trim()}>
              Add
            </Button>
          </div>
        </form>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="w-full lg:w-3/4">
            <Card className="shadow-md border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
                    <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Meeting Points
                  </CardTitle>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredMeetingPoints.length} {filteredMeetingPoints.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="w-[120px] text-left font-semibold px-[19px]">DATE</TableHead>
                        <TableHead className="w-[300px] text-left font-semibold px-[86px]">             DISCUSSION POINT</TableHead>
                        <TableHead className="w-[140px] text-center font-semibold mx-0 px-0">REQUEST BY</TableHead>
                        <TableHead className="w-[140px] text-center font-semibold px-0">STATUS</TableHead>
                        <TableHead className="w-[100px] text-center font-semibold mx-0 my-0 px-0">UPDATES</TableHead>
                        <TableHead className="w-[140px] text-right font-semibold">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                  
                  <div className="overflow-hidden" style={{
                  height: "600px"
                }}>
                    <ScrollArea className="h-full">
                      <Table>
                        <TableBody>
                          {loading ? <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                                <div className="mt-2 text-gray-500">Loading meeting points...</div>
                              </TableCell>
                            </TableRow> : filteredMeetingPoints.length === 0 ? <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No matching meeting points found.' : 'No meeting points found. Add one above.'}
                              </TableCell>
                            </TableRow> : <AnimatePresence>
                              {filteredMeetingPoints.map((point, index) => <motion.tr key={point.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"} initial={{
                            opacity: 0
                          }} animate={{
                            opacity: 1
                          }} exit={{
                            opacity: 0
                          }} transition={{
                            duration: 0.2
                          }}>
                                  <TableCell className="w-[120px] text-left font-medium text-gray-700 dark:text-gray-300">
                                    {point.date}
                                  </TableCell>
                                  <TableCell className="w-[300px] text-left px-[25px]">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="relative h-10 overflow-hidden">
                                            <ScrollArea className="h-10 w-full">
                                              <div className="pr-3 text-left">{point.discussion_point}</div>
                                            </ScrollArea>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md p-2 bg-white dark:bg-gray-800 shadow-lg">
                                          <p className="text-sm">{point.discussion_point}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </TableCell>
                                  <TableCell className="w-[140px] text-center px-0">
                                    <Select defaultValue={point.request_by || "unassigned"} onValueChange={value => handleRequestByChange(point.id, value)}>
                                      <SelectTrigger className="w-[120px] mx-auto bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                        <SelectValue placeholder="Select person" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="unassigned">Select person</SelectItem>
                                        {/* Dynamically generate list from unique requestBy values */}
                                        {Array.from(new Set(meetingPoints.map(p => p.request_by))).filter(Boolean).map(person => <SelectItem key={person} value={person as string}>
                                            {person}
                                          </SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell className="w-[140px] text-center px-0">
                                    <MeetingStatusBadge status={point.status} onChange={value => handleStatusChange(point.id, value as MeetingStatus)} />
                                  </TableCell>
                                  <TableCell className="w-[100px] text-center">
                                    <div className="flex justify-center">
                                      <Button variant="ghost" size="sm" onClick={() => handleAddUpdates(point)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900" title="View and Add Updates">
                                        <History size={16} />
                                        <span className="ml-2 font-medium">
                                          {updateCounts[point.id] || 0}
                                        </span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-[140px] text-right">
                                    <div className="flex justify-end space-x-2">
                                      <MeetingActionButton icon={Edit} label="Edit" onClick={() => handleEditMeeting(point)} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" />
                                      <MeetingActionButton icon={Trash2} label="Delete" variant="destructive" onClick={() => handleDeletePrompt(point)} className="hover:bg-red-100 dark:hover:bg-red-900" />
                                    </div>
                                  </TableCell>
                                </motion.tr>)}
                            </AnimatePresence>}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Card className="shadow-md border-gray-200 dark:border-gray-700 mb-6">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Meeting Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <MeetingSummaryCard status="not-started" count={notStartedCount} icon={AlertTriangle} label="Not Started" />
                  <MeetingSummaryCard status="on-going" count={onGoingCount} icon={Clock} label="On Going" />
                  <MeetingSummaryCard status="completed" count={completedCount} icon={CheckCircle} label="Completed" />
                  <MeetingSummaryCard status="rejected" count={rejectedCount} icon={XCircle} label="Rejected" />
                  <MeetingSummaryCard status="presented" count={presentedCount} icon={Presentation} label="Presented" />
                  <MeetingSummaryCard status={"updates" as MeetingSummaryStatus} count={updatesCount} icon={History} label="Updates" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4 pr-4">
                    {recentUpdates.length === 0 ? <p className="text-gray-500 text-center py-4">No recent updates.</p> : recentUpdates.map(update => <MeetingUpdateItem key={update.id} title={update.title} status={update.status} person={update.person} date={update.date} />)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <MeetingDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} onSave={handleSaveMeeting} meetingPoint={selectedMeeting || undefined} title={selectedMeeting ? "Edit Meeting Point" : "Add Meeting Point"} />
      
      {/* History Dialog */}
      {selectedMeeting && <HistoryDialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen} meetingPoint={selectedMeeting} />}
      
      {/* Updates Dialog */}
      {selectedMeeting && <UpdatesDialog open={updatesDialogOpen} onOpenChange={setUpdatesDialogOpen} meetingPoint={selectedMeeting} onUpdateAdded={handleUpdateAdded} />}
      
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
    </div>;
};
export default CatatanMeetings;