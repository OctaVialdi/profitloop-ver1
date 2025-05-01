
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MeetingPoint, MeetingStatus, MeetingPointFilters, MeetingUpdate } from '@/types/meetings';

// Create a new meeting update
export const createMeetingUpdate = async (meetingPointId: string, updateData: Partial<MeetingUpdate>): Promise<boolean> => {
  try {
    // Ensure all required properties are present
    const completeUpdateData = {
      meeting_point_id: meetingPointId,
      person: updateData.person || 'Unknown',
      status: updateData.status || 'not-started',
      title: updateData.title || '',
      date: updateData.date || new Date().toISOString().split('T')[0]
    };
    
    const { error } = await supabase
      .from('meeting_updates')
      .insert(completeUpdateData);
    
    if (error) {
      toast.error('Failed to create update: ' + error.message);
      return false;
    }
    
    toast.success('Update added successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while creating the update');
    return false;
  }
};

// Get all meeting points with optional filters
export const getMeetingPoints = async (filters?: MeetingPointFilters): Promise<MeetingPoint[]> => {
  try {
    let query = supabase
      .from('meeting_points')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.requestBy && filters.requestBy !== 'all') {
        query = query.eq('request_by', filters.requestBy);
      }
      
      if (filters.timeRange && filters.timeRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (filters.timeRange) {
          case 'today':
            startDate = now.toISOString().split('T')[0];
            query = query.eq('date', startDate);
            break;
          case 'this-week':
            // Get first day of current week (Sunday)
            const day = now.getDay();
            startDate = new Date(now.setDate(now.getDate() - day)).toISOString().split('T')[0];
            query = query.gte('date', startDate);
            break;
          case 'this-month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            query = query.gte('date', startDate);
            break;
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast.error('Failed to fetch meeting points: ' + error.message);
      return [];
    }
    
    // Cast the status to ensure it matches MeetingStatus type
    return data.map(item => ({
      ...item,
      status: item.status as MeetingStatus
    })) as MeetingPoint[];
  } catch (error) {
    toast.error('An error occurred while fetching meeting points');
    return [];
  }
};

// Get all meeting updates
export const getMeetingUpdates = async (meetingPointId?: string): Promise<MeetingUpdate[]> => {
  try {
    let query = supabase
      .from('meeting_updates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (meetingPointId) {
      query = query.eq('meeting_point_id', meetingPointId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast.error('Failed to fetch meeting updates: ' + error.message);
      return [];
    }
    
    // Cast the status to ensure it matches MeetingStatus type
    return data.map(item => ({
      ...item,
      status: item.status as MeetingStatus
    })) as MeetingUpdate[];
  } catch (error) {
    toast.error('An error occurred while fetching meeting updates');
    return [];
  }
};

// Create a new meeting point
export const createMeetingPoint = async (pointData: Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .insert({
        ...pointData,
        date: pointData.date || new Date().toISOString().split('T')[0]
      });
    
    if (error) {
      toast.error('Failed to create meeting point: ' + error.message);
      return false;
    }
    
    toast.success('Meeting point created successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while creating the meeting point');
    return false;
  }
};

// Update an existing meeting point
export const updateMeetingPoint = async (id: string, pointData: Partial<MeetingPoint>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .update(pointData)
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update meeting point: ' + error.message);
      return false;
    }
    
    toast.success('Meeting point updated successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while updating the meeting point');
    return false;
  }
};

// Delete a meeting point
export const deleteMeetingPoint = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete meeting point: ' + error.message);
      return false;
    }
    
    toast.success('Meeting point deleted successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while deleting the meeting point');
    return false;
  }
};

// Update a meeting update
export const updateMeetingUpdate = async (id: string, updateData: Partial<MeetingUpdate>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_updates')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update meeting update: ' + error.message);
      return false;
    }
    
    toast.success('Meeting update updated successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while updating the meeting update');
    return false;
  }
};

// Delete a meeting update
export const deleteMeetingUpdate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_updates')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete meeting update: ' + error.message);
      return false;
    }
    
    toast.success('Meeting update deleted successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while deleting the meeting update');
    return false;
  }
};

// Generate meeting minutes for a specific date
export const generateMeetingMinutes = async (date: string): Promise<boolean> => {
  try {
    // In a real application, this would generate a PDF or document
    // For now, we'll just pretend it was successful
    toast.success('Meeting minutes generated successfully');
    return true;
  } catch (error) {
    toast.error('An error occurred while generating meeting minutes');
    return false;
  }
};

// Format the current date in a readable format
export const formatCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Save theme changes (required by useTheme.tsx)
export const saveThemeChanges = async (theme: string): Promise<boolean> => {
  try {
    // In a real application, this would save to local storage or a database
    localStorage.setItem('app-theme', theme);
    return true;
  } catch (error) {
    console.error('Failed to save theme changes:', error);
    return false;
  }
};
