
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CandidateWithDetails, CandidateEvaluation, candidateService, EvaluationCategory } from "@/services/candidateService";
import { Star } from "lucide-react";
import { useUser } from "@/hooks/auth/useUser";
import { InterviewNotesSection } from "./InterviewNotesSection";
import { NewEvaluationForm } from "./NewEvaluationForm";
import { PreviousEvaluationsList } from "./PreviousEvaluationsList";
import { toast } from "sonner"; 

interface EvaluationSectionProps {
  candidate: CandidateWithDetails;
  onEvaluationSubmitted?: () => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  candidate,
  onEvaluationSubmitted
}) => {
  const { user } = useUser();
  const [evaluationCategories, setEvaluationCategories] = useState<EvaluationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewNotes, setInterviewNotes] = useState("");

  // Load interview notes if they exist
  useEffect(() => {
    const fetchInterviewNotes = async () => {
      try {
        if (candidate && candidate.id) {
          const notes = await candidateService.fetchInterviewNotes(candidate.id);
          if (notes) {
            setInterviewNotes(notes.content || "");
          }
        }
      } catch (error) {
        console.error("Error fetching interview notes:", error);
      }
    };
    fetchInterviewNotes();
  }, [candidate]);

  // Fetch evaluation criteria on component mount
  useEffect(() => {
    const fetchCriteria = async () => {
      setIsLoading(true);
      try {
        const data = await candidateService.fetchEvaluationCriteria();
        setEvaluationCategories(data);
      } catch (error) {
        console.error("Error fetching evaluation criteria:", error);
        toast.error("Failed to load evaluation criteria");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCriteria();
  }, []);
  
  // Handler for when an evaluation is reset/deleted
  const handleEvaluationReset = async () => {
    // Call the parent callback if provided to refresh candidate data
    if (onEvaluationSubmitted) {
      onEvaluationSubmitted();
    }
    
    // Show a toast notification
    toast.info("Candidate score has been recalculated");
  };

  // Handler for when interview notes are saved
  const handleNotesSaved = () => {
    // Refresh the candidate data to ensure we have the latest notes
    if (onEvaluationSubmitted) {
      onEvaluationSubmitted();
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Candidate Evaluation</h2>
          {candidate.score !== undefined && candidate.score !== null ? (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xl font-semibold">{candidate.score.toFixed(1)}</span>
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-500">Overall Score</span>
            </div>
          ) : (
            <div className="mt-2 text-gray-500">No evaluations yet</div>
          )}
        </div>

        <div className="space-y-6">
          {/* Interview Notes Section */}
          <InterviewNotesSection 
            candidateId={candidate.id}
            initialNotes={interviewNotes}
            onNotesSaved={handleNotesSaved}
          />

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">New Evaluation</h3>
            <NewEvaluationForm 
              candidateId={candidate.id}
              evaluationCategories={evaluationCategories}
              onEvaluationSubmitted={onEvaluationSubmitted}
              isLoading={isLoading}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Past Evaluations</h3>
            <PreviousEvaluationsList 
              evaluations={candidate.evaluations || []}
              onEvaluationReset={handleEvaluationReset}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
