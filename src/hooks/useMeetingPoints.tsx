
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
import { toast } from "sonner";

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
    try {
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
    } catch (error) {
      console.error("Error loading meeting data:", error);
      toast.error("Failed to load meeting data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoint = async (discussionPoint: string) => {
    try {
      // Date will be empty at first and added during create by the backend
      const newMeetingPoint = {
        date: "", // Empty date that will be filled on server
        discussion_point: discussionPoint,
        request_by: "",
        status: "not-started" as MeetingStatus
      };
      
      const result = await createMeetingPoint(newMeetingPoint);
      if (result) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating meeting point:", error);
      toast.error("Failed to create meeting point");
      return false;
    }
  };

  const handleStatusChange = async (meetingId: string, newStatus: MeetingStatus) => {
    try {
      const meeting = meetingPoints.find(m => m.id === meetingId);
      if (meeting) {
        const updated = await updateMeetingPoint(meetingId, { status: newStatus });
        if (updated) {
          loadData();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error updating meeting status:", error);
      toast.error("Failed to update meeting status");
      return false;
    }
  };
  
  const handleRequestByChange = async (meetingId: string, requestBy: string) => {
    try {
      const meeting = meetingPoints.find(m => m.id === meetingId);
      if (meeting) {
        const updated = await updateMeetingPoint(meetingId, { request_by: requestBy });
        if (updated) {
          loadData();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error updating requestBy:", error);
      toast.error("Failed to update request person");
      return false;
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      const success = await deleteMeetingPoint(meetingId);
      if (success) {
        loadData();
      }
      return success;
    } catch (error) {
      console.error("Error deleting meeting point:", error);
      toast.error("Failed to delete meeting point");
      return false;
    }
  };

  const handleUpdateMeeting = async (meetingId: string, meetingData: Partial<MeetingPoint>) => {
    try {
      const updated = await updateMeetingPoint(meetingId, meetingData);
      if (updated) {
        loadData();
      }
      return updated;
    } catch (error) {
      console.error("Error updating meeting point:", error);
      toast.error("Failed to update meeting point");
      return false;
    }
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
