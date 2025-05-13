
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { 
  MeetingPoint, 
  MeetingUpdate, 
  MeetingPointFilters, 
  MeetingStatus 
} from "@/types/meetings";
import { 
  getMeetingPoints, 
  getMeetingUpdates, 
  createMeetingPoint, 
  updateMeetingPoint, 
  deleteMeetingPoint, 
  generateMeetingMinutes 
} from "@/services/meetingService";

export const useCatatanMeetings = () => {
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
  const filteredMeetingPoints = meetingPoints.filter(point => 
    point.discussion_point.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (point.request_by && point.request_by.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateAdded = () => {
    loadData();
  };

  return {
    currentDate,
    meetingPoints,
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
  };
};
