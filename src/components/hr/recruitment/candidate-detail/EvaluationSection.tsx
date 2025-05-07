
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CandidateWithDetails, CandidateEvaluation, candidateService } from "@/services/candidateService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Star, StarHalf } from "lucide-react";
import { useUser } from "@/hooks/auth";

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
  
  const [evaluation, setEvaluation] = useState<{
    technical_skills: number | null;
    communication: number | null;
    cultural_fit: number | null;
    experience_relevance: number | null;
    overall_impression: number | null;
    comments: string;
  }>({
    technical_skills: null,
    communication: null,
    cultural_fit: null,
    experience_relevance: null,
    overall_impression: null,
    comments: ""
  });

  const handleRatingChange = (field: string) => (value: string) => {
    setEvaluation(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !evaluation.technical_skills &&
      !evaluation.communication &&
      !evaluation.cultural_fit &&
      !evaluation.experience_relevance &&
      !evaluation.overall_impression
    ) {
      toast.error("Please provide at least one rating before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await candidateService.submitEvaluation({
        ...evaluation,
        candidate_id: candidate.id,
        evaluator_id: user?.id || null,
        average_score: 0 // This will be calculated in the service
      });

      if (result.success) {
        toast.success("Evaluation submitted successfully");
        
        // Reset the form
        setEvaluation({
          technical_skills: null,
          communication: null,
          cultural_fit: null,
          experience_relevance: null,
          overall_impression: null,
          comments: ""
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
        {candidate.evaluations.map((eval) => (
          <div key={eval.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  Evaluation from {eval.evaluator_name || "Recruiter"}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(eval.created_at).toLocaleDateString()} at{" "}
                  {new Date(eval.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-lg">{eval.average_score.toFixed(1)}</span>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {eval.technical_skills && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technical Skills:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < eval.technical_skills! 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {eval.communication && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Communication:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < eval.communication! 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {eval.cultural_fit && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cultural Fit:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < eval.cultural_fit! 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {eval.experience_relevance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience Relevance:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < eval.experience_relevance! 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {eval.overall_impression && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Impression:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < eval.overall_impression! 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {eval.comments && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-600">Comments:</h5>
                <p className="text-sm mt-1">{eval.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRatingField = (
    label: string,
    field: keyof typeof evaluation,
    value: number | null
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-base">{label}</Label>
          {value && (
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 ${
                    i < value 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
          )}
        </div>
        <RadioGroup
          value={value?.toString() || ""}
          onValueChange={handleRatingChange(field)}
          className="flex space-x-1"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex items-center space-x-1">
              <RadioGroupItem
                value={rating.toString()}
                id={`${field}-${rating}`}
                className="sr-only"
              />
              <Label
                htmlFor={`${field}-${rating}`}
                className={`cursor-pointer rounded-full p-1 hover:bg-gray-100 ${
                  value === rating ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                <Star className={`h-6 w-6 ${
                  value === rating ? "fill-yellow-400 text-yellow-400" : ""
                }`} />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Candidate Evaluation</h2>
          {candidate.score ? (
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
            
            <div className="grid gap-6">
              {renderRatingField("Technical Skills", "technical_skills", evaluation.technical_skills)}
              {renderRatingField("Communication", "communication", evaluation.communication)}
              {renderRatingField("Cultural Fit", "cultural_fit", evaluation.cultural_fit)}
              {renderRatingField("Experience Relevance", "experience_relevance", evaluation.experience_relevance)}
              {renderRatingField("Overall Impression", "overall_impression", evaluation.overall_impression)}
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Add your comments about the candidate..."
                  value={evaluation.comments}
                  onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Evaluation"}
              </Button>
            </div>
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
