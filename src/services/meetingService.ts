
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MeetingPoint, MeetingStatus, MeetingUpdate } from "@/types/meetings";

// Function to get all meeting points with optional filters
export const getMeetingPoints = async (filters?: any): Promise<MeetingPoint[]> => {
  try {
    let query = supabase.from('meeting_points').select('*');
    
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
        
        if (filters.timeRange === 'today') {
          startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (filters.timeRange === 'this-week') {
          const day = now.getDay();
          startDate = new Date(now.setDate(now.getDate() - day));
        } else if (filters.timeRange === 'this-month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meeting points:', error);
      toast.error('Failed to fetch meeting points');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching meeting points:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Function to get meeting updates for a specific meeting point or all updates
export const getMeetingUpdates = async (meetingPointId?: string): Promise<MeetingUpdate[]> => {
  try {
    let query = supabase.from('meeting_updates').select('*');
    
    if (meetingPointId) {
      query = query.eq('meeting_point_id', meetingPointId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meeting updates:', error);
      toast.error('Failed to fetch meeting updates');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching meeting updates:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Function to create a new meeting point
export const createMeetingPoint = async (meetingData: Omit<MeetingPoint, 'id' | 'created_at' | 'updated_at' | 'organization_id'>): Promise<boolean> => {
  try {
    // Format the current date for the meeting point
    if (!meetingData.date) {
      meetingData.date = formatCurrentDate();
    }
    
    const { error } = await supabase
      .from('meeting_points')
      .insert(meetingData);
    
    if (error) {
      console.error('Error creating meeting point:', error);
      toast.error('Failed to create meeting point');
      return false;
    }
    
    toast.success('Meeting point created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating meeting point:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Function to update an existing meeting point
export const updateMeetingPoint = async (id: string, meetingData: Partial<MeetingPoint>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_points')
      .update(meetingData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating meeting point:', error);
      toast.error('Failed to update meeting point');
      return false;
    }
    
    toast.success('Meeting point updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating meeting point:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Function to delete a meeting point
export const deleteMeetingPoint = async (id: string): Promise<boolean> => {
  try {
    // Delete associated updates first
    const { error: updateDeleteError } = await supabase
      .from('meeting_updates')
      .delete()
      .eq('meeting_point_id', id);
    
    if (updateDeleteError) {
      console.error('Error deleting associated updates:', updateDeleteError);
    }
    
    // Then delete the meeting point
    const { error } = await supabase
      .from('meeting_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting meeting point:', error);
      toast.error('Failed to delete meeting point');
      return false;
    }
    
    toast.success('Meeting point deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error deleting meeting point:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

export const createMeetingUpdate = async (updateData: Omit<MeetingUpdate, 'id' | 'created_at'>) => {
  try {
    // Explicitly list the fields to insert instead of using spread operator
    const { error: insertError } = await supabase
      .from('meeting_updates')
      .insert({
        meeting_point_id: updateData.meeting_point_id,
        title: updateData.title,
        status: updateData.status,
        person: updateData.person,
        date: updateData.date,
        // Include any other fields that need to be inserted
      });

    if (insertError) {
      console.error('Error creating meeting update:', insertError);
      toast.error('Failed to create meeting update');
      return false;
    }

    toast.success('Meeting update created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating meeting update:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Function to update an existing meeting update
export const updateMeetingUpdate = async (id: string, updateData: Partial<MeetingUpdate>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_updates')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating meeting update:', error);
      toast.error('Failed to update meeting update');
      return false;
    }
    
    toast.success('Meeting update updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating meeting update:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Function to delete a meeting update
export const deleteMeetingUpdate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meeting_updates')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting meeting update:', error);
      toast.error('Failed to delete meeting update');
      return false;
    }
    
    toast.success('Meeting update deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error deleting meeting update:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Function to generate meeting minutes document
export const generateMeetingMinutes = async (date: string): Promise<boolean> => {
  // This is a placeholder function that would be connected to a real PDF/document generation service
  try {
    // In a real app, this would connect to a backend service to generate a PDF
    console.log(`Generating meeting minutes for ${date}`);
    
    // Simulate successful generation
    return true;
  } catch (error) {
    console.error('Error generating meeting minutes:', error);
    toast.error('Failed to generate meeting minutes');
    return false;
  }
};

// Function to format the current date in a consistent format
export const formatCurrentDate = (): string => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} ${year} - ${hours}.${minutes}`;
};

// Function to save theme changes to database
export const saveThemeChanges = async (themeMode: string, userId: string): Promise<boolean> => {
  try {
    // Update the user's preferences in the database
    const { error } = await supabase
      .from('profiles')
      .update({ 
        preferences: { dark_mode: themeMode === 'dark' } 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error saving theme changes:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error saving theme changes:', error);
    return false;
  }
};
