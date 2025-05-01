
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MeetingPoint, MeetingUpdate, MeetingStatus } from "@/types/meetings";

export async function getMeetingPoints(filters: {
  status?: string;
  requestBy?: string;
  timeRange?: string;
} = {}) {
  try {
    let query = supabase
      .from('meeting_points')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.requestBy && filters.requestBy !== 'all') {
      query = query.eq('request_by', filters.requestBy);
    }
    
    // Time range filter would need more complex logic depending on your requirements
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Cast the response data to ensure the status is of type MeetingStatus
    return (data || []).map(item => ({
      ...item,
      status: item.status as MeetingStatus
    })) as MeetingPoint[];
  } catch (error: any) {
    console.error('Error fetching meeting points:', error.message);
    toast.error('Failed to load meeting points');
    return [];
  }
}

export async function getMeetingUpdates(meetingPointId?: string) {
  try {
    let query = supabase
      .from('meeting_updates')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If a specific meeting point ID is provided, filter by it
    if (meetingPointId) {
      query = query.eq('meeting_point_id', meetingPointId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Cast the response data to ensure the status is of type MeetingStatus
    return (data || []).map(item => ({
      ...item,
      status: item.status as MeetingStatus
    })) as MeetingUpdate[];
  } catch (error: any) {
    console.error('Error fetching meeting updates:', error.message);
    toast.error('Failed to load meeting updates');
    return [];
  }
}

export async function createMeetingPoint(meetingPoint: Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) {
  try {
    // Get current user profile to get organization_id
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session found');
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', session.user.id)
      .single();
      
    if (!profile?.organization_id) {
      throw new Error('No organization found for user');
    }
    
    const { data, error } = await supabase
      .from('meeting_points')
      .insert({
        ...meetingPoint,
        organization_id: profile.organization_id
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success('Meeting point created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating meeting point:', error.message);
    toast.error('Failed to create meeting point');
    return null;
  }
}

export async function updateMeetingPoint(id: string, updates: Partial<MeetingPoint>) {
  try {
    const { data, error } = await supabase
      .from('meeting_points')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    // If status was updated, add a history record
    if (updates.status) {
      await createMeetingUpdate({
        meeting_point_id: id,
        status: updates.status,
        person: updates.request_by || 'Unknown',
        date: new Date().toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short',
          year: 'numeric'
        }),
        title: data.discussion_point
      });
    }
    
    toast.success('Meeting point updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error updating meeting point:', error.message);
    toast.error('Failed to update meeting point');
    return null;
  }
}

export async function deleteMeetingPoint(id: string) {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    toast.success('Meeting point deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting meeting point:', error.message);
    toast.error('Failed to delete meeting point');
    return false;
  }
}

export async function createMeetingUpdate(update: Omit<MeetingUpdate, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('meeting_updates')
      .insert(update)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating meeting update:', error.message);
    toast.error('Failed to create meeting update');
    return null;
  }
}

export async function generateMeetingMinutes(date: string) {
  try {
    // Get meeting points for the given date
    const { data: meetingPoints, error } = await supabase
      .from('meeting_points')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Format into a document
    const minutes = {
      title: `Meeting Minutes - ${date}`,
      points: meetingPoints || [],
      generatedAt: new Date().toISOString()
    };
    
    toast.success('Meeting minutes generated successfully');
    return minutes;
  } catch (error: any) {
    console.error('Error generating meeting minutes:', error.message);
    toast.error('Failed to generate meeting minutes');
    return null;
  }
}
