
// This is a partial update to fix the createMeetingUpdate function
// We need to fix the spread operator error

export const createMeetingUpdate = async (updateData: Omit<MeetingUpdate, 'id' | 'created_at' | 'updated_at'>) => {
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
}
