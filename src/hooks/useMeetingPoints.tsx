
import { useState, useEffect } from "react";
import { MeetingPoint, MeetingUpdate, MeetingStatus, MeetingPointFilters } from "@/types/meetings";
import { 
  getMeetingPoints, 
  getMeetingUpdates,
  createMeetingPoint,
  updateMeetingPoint,
  deleteMeetingPoint
} from "@/services/meetingService";
import { useOrganization } from "@/hooks/useOrganization";

export const useMeetingPoints = () => {
  const { organization } = useOrganization();
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<MeetingUpdate[]>([]);
  const [updateCounts, setUpdateCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<MeetingPointFilters>({
    status: 'all',
    requestBy: 'all',
    timeRange: 'all'
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

  const handleAddPoint = async (discussionPoint: string) => {
    // Date will be empty at first and added during create by the backend
    const newMeetingPoint = {
      date: "", // Empty date that will be filled on server
      discussion_point: discussionPoint,
      request_by: "",
      status: "not-started" as MeetingStatus
    };
    
    const result = await createMeetingPoint(newMeetingPoint);
    if (result) {
      loadData();
      return true;
    }
    return false;
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

  const handleDeleteMeeting = async (meetingId: string) => {
    const success = await deleteMeetingPoint(meetingId);
    if (success) {
      loadData();
    }
    return success;
  };

  const handleUpdateMeeting = async (meetingId: string, meetingData: Partial<MeetingPoint>) => {
    const updated = await updateMeetingPoint(meetingId, meetingData);
    if (updated) {
      loadData();
    }
    return updated;
  };

  // Calculate counts for different status types
  const notStartedCount = meetingPoints.filter(point => point.status === "not-started").length;
  const onGoingCount = meetingPoints.filter(point => point.status === "on-going").length;
  const completedCount = meetingPoints.filter(point => point.status === "completed").length;
  const rejectedCount = meetingPoints.filter(point => point.status === "rejected").length;
  const presentedCount = meetingPoints.filter(point => point.status === "presented").length;

  // Get unique requestBy options
  const requestByOptions = Array.from(
    new Set(meetingPoints.map(p => p.request_by))
  ).filter(Boolean) as string[];

  return {
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
  };
};
