
import { supabase } from "@/integrations/supabase/client";
import { MeetingPoint, MeetingPointFilters, MeetingUpdate } from "@/types/meetings";

// Function to get meeting points with optional filters
export const getMeetingPoints = async (filters: MeetingPointFilters): Promise<MeetingPoint[]> => {
  try {
    let query = supabase
      .from('meeting_points')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    // Apply request_by filter
    if (filters.requestBy && filters.requestBy !== 'all') {
      query = query.eq('request_by', filters.requestBy);
    }
    
    // Apply time range filter
    if (filters.timeRange && filters.timeRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'this-week':
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
          startDate = new Date(now.setDate(diff));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      query = query.gte('created_at', startDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching meeting points:", error);
      return [];
    }
    
    return data as MeetingPoint[];
  } catch (err) {
    console.error("Exception fetching meeting points:", err);
    return [];
  }
};

export const getMeetingUpdates = async (): Promise<MeetingUpdate[]> => {
  try {
    const { data, error } = await supabase
      .from('meeting_updates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching meeting updates:", error);
      return [];
    }
    
    return data as MeetingUpdate[];
  } catch (err) {
    console.error("Exception fetching meeting updates:", err);
    return [];
  }
};

export const createMeetingPoint = async (meetingPoint: Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>): Promise<MeetingPoint | null> => {
  try {
    // Set the date if not provided
    if (!meetingPoint.date) {
      meetingPoint.date = formatCurrentDate();
    }
    
    const { data, error } = await supabase
      .from('meeting_points')
      .insert([meetingPoint])
      .select();
    
    if (error) {
      console.error("Error creating meeting point:", error);
      return null;
    }
    
    return data[0] as MeetingPoint;
  } catch (err) {
    console.error("Exception creating meeting point:", err);
    return null;
  }
};

export const updateMeetingPoint = async (id: string, data: Partial<MeetingPoint>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .update(data)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating meeting point:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception updating meeting point:", err);
    return false;
  }
};

export const deleteMeetingPoint = async (id: string): Promise<boolean> => {
  try {
    // First delete all updates related to this meeting point
    const { error: updateError } = await supabase
      .from('meeting_updates')
      .delete()
      .eq('meeting_point_id', id);
    
    if (updateError) {
      console.error("Error deleting related meeting updates:", updateError);
      return false;
    }
    
    // Then delete the meeting point itself
    const { error } = await supabase
      .from('meeting_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting meeting point:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception deleting meeting point:", err);
    return false;
  }
};

export const generateMeetingMinutes = async (date: string): Promise<boolean> => {
  try {
    // In a real implementation, this would generate a PDF or document
    // For now, we'll just simulate success
    console.log(`Generating meeting minutes for ${date}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (err) {
    console.error("Exception generating meeting minutes:", err);
    return false;
  }
};

export const formatCurrentDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('id-ID', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month} ${year} - ${hours}.${minutes}`;
};

// Fixed function with proper object spread syntax
export const saveThemeChanges = async (theme: string, userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("Cannot save theme: No user ID provided");
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ preferences: { theme } })
      .eq('id', userId);
      
    if (error) {
      console.error("Error saving theme preference:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception when saving theme preference:", error);
    return false;
  }
};

// Add meeting update
export const addMeetingUpdate = async (update: Omit<MeetingUpdate, 'id' | 'created_at' | 'updated_at'>): Promise<MeetingUpdate | null> => {
  try {
    const { data, error } = await supabase
      .from('meeting_updates')
      .insert([update])
      .select();
    
    if (error) {
      console.error("Error adding meeting update:", error);
      return null;
    }
    
    return data[0] as MeetingUpdate;
  } catch (err) {
    console.error("Exception adding meeting update:", err);
    return null;
  }
};

// Get meeting updates for a specific meeting point
export const getMeetingPointUpdates = async (meetingPointId: string): Promise<MeetingUpdate[]> => {
  try {
    const { data, error } = await supabase
      .from('meeting_updates')
      .select('*')
      .eq('meeting_point_id', meetingPointId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching meeting point updates:", error);
      return [];
    }
    
    return data as MeetingUpdate[];
  } catch (err) {
    console.error("Exception fetching meeting point updates:", err);
    return [];
  }
};
