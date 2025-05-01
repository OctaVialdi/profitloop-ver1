
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
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
  MeetingStatus
} from "@/types/meetings";

export const useMeetingPoints = () => {
  const { organization } = useOrganization();
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<MeetingUpdate[]>([]);
  const [newPoint, setNewPoint] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updateCounts, setUpdateCounts] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<MeetingPointFilters>({
    status: 'all',
    requestBy: 'all',
    timeRange: 'all'
  });
  
  // Get unique request by values for dropdown
  const requestByOptions = Array.from(
    new Set(meetingPoints.map(p => p.request_by).filter(Boolean))
  ) as string[];
  
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
  
  const handleNewPointChange = (value: string) => {
    setNewPoint(value);
  };
  
  const handleAddPoint = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPoint.trim() !== "") {
      try {
        const newMeetingPoint = {
          date: new Date().toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
          }),
          discussion_point: newPoint.trim(),
          request_by: "",
          status: "not-started" as MeetingStatus
        };
        
        console.log("Creating new meeting point:", newMeetingPoint);
        const result = await createMeetingPoint(newMeetingPoint);
        
        if (result) {
          toast.success("New meeting point added");
          setNewPoint("");
          await loadData();
        } else {
          toast.error("Failed to add meeting point");
        }
      } catch (error) {
        console.error("Error adding meeting point:", error);
        toast.error("Error adding meeting point");
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

  const handleSaveMeeting = async (meetingData: Partial<MeetingPoint>, selectedMeeting: MeetingPoint | null) => {
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
  
  const handleDeleteMeeting = async (meetingId: string) => {
    const success = await deleteMeetingPoint(meetingId);
    if (success) {
      loadData();
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

  return {
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
  };
};
