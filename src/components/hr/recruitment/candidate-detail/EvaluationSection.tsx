import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  CandidateWithDetails, 
  CandidateEvaluation, 
  candidateService, 
  EvaluationCategory,
  EvaluationCriteriaScore 
} from "@/services/candidateService";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/hooks/auth/useUser";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface EvaluationSectionProps {
  candidate: CandidateWithDetails;
  onEvaluationSubmitted?: () => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  candidate,
  onEvaluationSubmitted
}) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationCategories, setEvaluationCategories] = useState<EvaluationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const [criteriaScores, setCriteriaScores] = useState<EvaluationCriteriaScore[]>([]);
  const [comments, setComments] = useState("");

  // For backward compatibility
  const [legacyEvaluation, setLegacyEvaluation] = useState({
    technical_skills: null as number | null,
    communication: null as number | null,
    cultural_fit: null as number | null,
    experience_relevance: null as number | null,
    overall_impression: null as number | null
  });

  // Fetch evaluation criteria on component mount
  useEffect(() => {
    const fetchCriteria = async () => {
      setIsLoading(true);
      try {
        const data = await candidateService.fetchEvaluationCriteria();
        setEvaluationCategories(data);
        
        // Initialize expanded categories - expand the first one by default
        if (data.length > 0) {
          setExpandedCategories({ [data[0].id]: true });
        }
      } catch (error) {
        console.error("Error fetching evaluation criteria:", error);
        toast.error("Failed to load evaluation criteria");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCriteria();
  }, []);

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

  // Legacy rating change handler for backward compatibility
  const handleLegacyRatingChange = (field: keyof typeof legacyEvaluation) => (value: number) => {
    setLegacyEvaluation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to submit an evaluation");
      return;
    }
    
    // Validate form - either criteria scores or legacy ratings must be provided
    if (
      criteriaScores.length === 0 &&
      !legacyEvaluation.technical_skills &&
      !legacyEvaluation.communication &&
      !legacyEvaluation.cultural_fit &&
      !legacyEvaluation.experience_relevance &&
      !legacyEvaluation.overall_impression
    ) {
      toast.error("Please provide at least one rating before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await candidateService.submitEvaluation({
        ...legacyEvaluation,
        comments,
        candidate_id: candidate.id,
        evaluator_id: user.id || null,
        average_score: 0, // This will be calculated by the database trigger
        criteria_scores: criteriaScores.length > 0 ? criteriaScores : undefined
      });

      if (result.success) {
        toast.success("Evaluation submitted successfully");
        
        // Reset the form
        setCriteriaScores([]);
        setComments("");
        setLegacyEvaluation({
          technical_skills: null,
          communication: null,
          cultural_fit: null,
          experience_relevance: null,
          overall_impression: null
        });
        
        // Notify parent component
        if (onEvaluationSubmitted) {
          onEvaluationSubmitted();
        }
      } else {
        toast.error("Failed to submit evaluation");
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

  const renderPreviousEvaluations = () => {
    if (!candidate.evaluations || candidate.evaluations.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No evaluations yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {candidate.evaluations.map((evaluation) => (
          <div key={evaluation.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  Evaluation from {evaluation.evaluator_name || "Recruiter"}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(evaluation.created_at).toLocaleDateString()} at{" "}
                  {new Date(evaluation.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-lg">{evaluation.average_score.toFixed(1)}</span>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            {/* Render either criteria scores or legacy ratings */}
            {evaluation.criteria_scores && evaluation.criteria_scores.length > 0 ? (
              <div className="mt-3">
                <h5 className="text-sm font-medium mb-2">Ratings:</h5>
                <Accordion type="multiple" className="w-full">
                  {Array.from(new Set(evaluation.criteria_scores.map(score => score.category))).map(categoryName => {
                    // Ensure categoryName is a valid string
                    const category = typeof categoryName === 'string' ? categoryName : String(categoryName);
                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="text-sm font-medium">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {evaluation.criteria_scores
                              ?.filter(score => score.category === categoryName)
                              .map(score => (
                                <div key={score.criterion_id} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 flex-1">{score.question}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < score.score 
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
                    );
                  })}
                </Accordion>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {evaluation.technical_skills && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Technical Skills:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < evaluation.technical_skills! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.communication && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communication:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < evaluation.communication! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.cultural_fit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cultural Fit:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < evaluation.cultural_fit! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.experience_relevance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience Relevance:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < evaluation.experience_relevance! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.overall_impression && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Impression:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < evaluation.overall_impression! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {evaluation.comments && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-600">Comments:</h5>
                <p className="text-sm mt-1">{evaluation.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Improved Star Rating component that fills all stars up to the selected rating
  const StarRating: React.FC<{ 
    value: number, 
    onChange: (value: number) => void 
  }> = ({ value, onChange }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          >
            <Star 
              className={`h-6 w-6 ${
                rating <= value 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">New Evaluation</h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {evaluationCategories.map(category => (
                    <div key={category.id} className="border rounded-lg">
                      <div 
                        className="p-3 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <h4 className="font-medium">{category.name}</h4>
                        {expandedCategories[category.id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                      
                      {expandedCategories[category.id] && (
                        <div className="p-3 space-y-4">
                          {category.criteria.map(criterion => {
                            const criterionScore = getCriterionScore(criterion.id);
                            return (
                              <div key={criterion.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-sm">{criterion.question}</Label>
                                  {criterionScore > 0 && (
                                    <span className="text-sm font-medium">{criterionScore}/5</span>
                                  )}
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
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add your comments about the candidate..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
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
                  ) : "Submit Evaluation"}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Past Evaluations</h3>
            {renderPreviousEvaluations()}
          </div>
        </div>
      </div>
    </Card>
  );
};
