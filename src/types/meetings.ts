
export type MeetingStatus = "not-started" | "on-going" | "completed" | "rejected" | "presented";

export interface MeetingPoint {
  id: string;
  date: string;
  discussion_point: string;
  request_by: string | null;
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
  organization_id: string | null;
}

export interface MeetingUpdate {
  id: string;
  meeting_point_id: string;
  status: MeetingStatus;
  person: string;
  date: string;
  title: string;
  created_at: string;
}

export interface MeetingPointFilters {
  status: string;
  requestBy: string;
  timeRange: string;
}
