
import React, { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { CandidateEvaluation, candidateService } from "@/services/candidateService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  groupCriteriaByCategory, 
  validateEvaluationScore,
  ensureEvaluationHasCriteriaScores
} from "@/utils/evaluationUtils";

interface PreviousEvaluationsListProps {
  evaluations: CandidateEvaluation[];
  onEvaluationReset?: () => void;
}

export const PreviousEvaluationsList: React.FC<PreviousEvaluationsListProps> = ({
  evaluations,
  onEvaluationReset
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<CandidateEvaluation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle opening the reset confirmation dialog
  const handleResetClick = (evaluation: CandidateEvaluation) => {
    setSelectedEvaluation(evaluation);
    setDialogOpen(true);
  };

  // Function to handle the actual evaluation deletion
  const handleConfirmReset = async () => {
    if (!selectedEvaluation) return;
    
    setIsDeleting(true);
    try {
      const success = await candidateService.deleteEvaluation(selectedEvaluation.id);
      
      if (success) {
        toast.success("Evaluation successfully reset");
        if (onEvaluationReset) {
          onEvaluationReset();
        }
      } else {
        toast.error("Failed to reset evaluation");
      }
    } catch (error) {
      console.error("Error resetting evaluation:", error);
      toast.error("An error occurred while resetting the evaluation");
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
      setSelectedEvaluation(null);
    }
  };

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No evaluations yet</p>
      </div>
    );
  }

  // Ensure all evaluations have criteria scores properly formatted
  const processedEvaluations = evaluations.map(evaluation => 
    ensureEvaluationHasCriteriaScores(evaluation)
  );

  return (
    <>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-6">
          {processedEvaluations.map(evaluation => {
            // Group criteria by category for better organization
            const criteriaByCategory = groupCriteriaByCategory(evaluation.criteria_scores || []);
            
            return (
              <div key={evaluation.id} className="border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      Evaluation from {evaluation.evaluator_name || "Recruiter"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(evaluation.created_at).toLocaleDateString()} at{" "}
                      {new Date(evaluation.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                      <span className="font-semibold text-lg">{evaluation.average_score.toFixed(1)}</span>
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => handleResetClick(evaluation)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Display criteria-based ratings grouped by category */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Ratings:</h5>
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(criteriaByCategory).map(([category, criteria]) => (
                        <AccordionItem 
                          key={category} 
                          value={category} 
                          className="border rounded-md mb-3"
                        >
                          <AccordionTrigger className="text-sm font-medium px-4 py-2 bg-gray-50 hover:bg-gray-100">
                            {category}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-3 border-t bg-white">
                            <div className="space-y-4">
                              {criteria.map(criterion => (
                                <div 
                                  key={criterion.criterion_id} 
                                  className="border-b pb-3 last:border-0 last:pb-0"
                                >
                                  <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">{criterion.question}</span>
                                    <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                                      {criterion.score}/5
                                    </span>
                                  </div>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-5 w-5 ${
                                          i < criterion.score 
                                          ? "text-yellow-400 fill-yellow-400" 
                                          : "text-gray-300"
                                        }`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {evaluation.comments && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Comments:</h5>
                      <p className="text-sm">{evaluation.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Alert Dialog for confirmation */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Evaluation</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>
                  Are you sure you want to reset this evaluation? This action cannot be undone.
                </p>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mt-2">
                  <p className="font-semibold mb-1">Warning:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>This will permanently delete the evaluation from this candidate.</li>
                    <li>The candidate's average score will be recalculated based on remaining evaluations.</li>
                    <li>If this is the only evaluation, the candidate's score will be removed entirely.</li>
                  </ul>
                </div>
                {selectedEvaluation && !validateEvaluationScore(selectedEvaluation) && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mt-2">
                    <p className="font-semibold">Score validation warning:</p>
                    <p className="text-sm">This evaluation appears to have inconsistent scoring that may be affecting the candidate's overall score accuracy.</p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmReset} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Resetting..." : "Reset Evaluation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
