
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { candidateService, InterviewNotes } from "@/services/candidateService";
import { useUser } from "@/hooks/auth/useUser";

interface InterviewNotesSectionProps {
  candidateId: string;
  initialNotes: string;
  onNotesSaved?: () => void;
}

export const InterviewNotesSection: React.FC<InterviewNotesSectionProps> = ({
  candidateId,
  initialNotes,
  onNotesSaved
}) => {
  const { user } = useUser();
  const [interviewNotes, setInterviewNotes] = useState(initialNotes);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);

  // Load interview notes when component mounts or candidateId changes
  useEffect(() => {
    const fetchInterviewNotes = async () => {
      try {
        const notes = await candidateService.fetchInterviewNotes(candidateId);
        if (notes) {
          setInterviewNotes(notes.content || "");
        }
        setNotesLoaded(true);
      } catch (error) {
        console.error("Error fetching interview notes:", error);
        setNotesLoaded(true);
      }
    };

    fetchInterviewNotes();
  }, [candidateId]);

  const handleSaveInterviewNotes = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to save notes");
      return;
    }
    
    setIsSavingNotes(true);
    try {
      const result = await candidateService.saveInterviewNotes({
        candidate_id: candidateId,
        content: interviewNotes,
        created_by: user.id
      });
      if (result.success) {
        toast.success("Interview notes saved successfully");
        if (onNotesSaved) {
          onNotesSaved();
        }
      } else {
        toast.error("Failed to save interview notes");
      }
    } catch (error) {
      toast.error("Error saving interview notes");
      console.error("Error saving interview notes:", error);
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (!notesLoaded) {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Interview Notes</h3>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Interview Notes</h3>
      <div className="space-y-3">
        <div>
          <Textarea 
            id="interviewNotes" 
            placeholder="Add your initial observations and important points from the interview..." 
            value={interviewNotes} 
            onChange={e => setInterviewNotes(e.target.value)} 
            rows={4} 
            className="mt-2" 
          />
        </div>
        <Button 
          onClick={handleSaveInterviewNotes} 
          disabled={isSavingNotes} 
          variant="outline" 
          className="w-full"
        >
          {isSavingNotes ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Notes...
            </> : "Save Interview Notes"}
        </Button>
      </div>
    </div>
  );
};
