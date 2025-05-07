
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { candidateService, EvaluationCategory, EvaluationCriteriaScore } from "@/services/candidateService";
import { useUser } from "@/hooks/auth/useUser";
import { StarRating } from "./StarRating";

interface NewEvaluationFormProps {
  candidateId: string;
  evaluationCategories: EvaluationCategory[];
  onEvaluationSubmitted?: () => void;
  isLoading: boolean;
}

export const NewEvaluationForm: React.FC<NewEvaluationFormProps> = ({
  candidateId,
  evaluationCategories,
  onEvaluationSubmitted,
  isLoading
}) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [criteriaScores, setCriteriaScores] = useState<EvaluationCriteriaScore[]>([]);
  const [comments, setComments] = useState("");
  
  const handleRatingChange = (criterionId: string, categoryId: string, question: string, categoryName: string) => (score: number) => {
    setCriteriaScores(prev => {
      // Check if this criterion already has a score
      const existingIndex = prev.findIndex(item => item.criterion_id === criterionId);
      if (existingIndex >= 0) {
        // Update existing score
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          score
        };
        return updated;
      } else {
        // Add new score
        return [...prev, {
          criterion_id: criterionId,
          category_id: categoryId,
          score,
          question,
          category: categoryName
        }];
      }
    });
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to submit an evaluation");
      return;
    }

    // Validate form - criterion scores must be provided
    if (criteriaScores.length === 0) {
      toast.error("Please provide at least one rating before submitting");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await candidateService.submitEvaluation({
        comments,
        candidate_id: candidateId,
        evaluator_id: user.id || null,
        average_score: 0, // This will be calculated by the database trigger
        criteria_scores: criteriaScores,
        // Legacy fields set to null
        technical_skills: null,
        communication: null,
        cultural_fit: null,
        experience_relevance: null,
        overall_impression: null
      });
      
      if (result.success) {
        toast.success("Evaluation submitted successfully");

        // Reset the form
        setCriteriaScores([]);
        setComments("");

        // Notify parent component
        if (onEvaluationSubmitted) {
          onEvaluationSubmitted();
        }
      } else {
        toast.error("Failed to submit evaluation");
        console.error("Error details:", result.error);
      }
    } catch (error) {
      toast.error("Error submitting evaluation");
      console.error("Error submitting evaluation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCriterionScore = (criterionId: string) => {
    const found = criteriaScores.find(item => item.criterion_id === criterionId);
    return found ? found.score : 0;
  };
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Auto-expand the first category when categories are loaded
  React.useEffect(() => {
    if (evaluationCategories.length > 0 && Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [evaluationCategories[0].id]: true });
    }
  }, [evaluationCategories, expandedCategories]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        <div className="space-y-4">
          {evaluationCategories.map(category => (
            <div key={category.id} className="border rounded-lg">
              <div 
                className="p-3 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100" 
                onClick={() => toggleCategory(category.id)}
              >
                <h4 className="font-medium">{category.name}</h4>
                {expandedCategories[category.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              
              {expandedCategories[category.id] && (
                <div className="p-3 space-y-4">
                  {category.criteria.map(criterion => {
                    const criterionScore = getCriterionScore(criterion.id);
                    return (
                      <div key={criterion.id} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">{criterion.question}</Label>
                          {criterionScore > 0 && <span className="text-sm font-medium">{criterionScore}/5</span>}
                        </div>
                        <StarRating 
                          value={criterionScore} 
                          onChange={handleRatingChange(criterion.id, category.id, criterion.question, category.name)} 
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="comments">Final Comments</Label>
          <Textarea 
            id="comments" 
            placeholder="Add your final evaluation comments about the candidate..." 
            value={comments} 
            onChange={e => setComments(e.target.value)} 
            rows={4} 
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Evaluation"
          )}
        </Button>
      </div>
    </ScrollArea>
  );
};
