
import React from "react";
import { Star } from "lucide-react";
import { CandidateEvaluation } from "@/services/candidateService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviousEvaluationsListProps {
  evaluations: CandidateEvaluation[];
}

export const PreviousEvaluationsList: React.FC<PreviousEvaluationsListProps> = ({
  evaluations
}) => {
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No evaluations yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6">
        {evaluations.map(evaluation => (
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
                            {evaluation.criteria_scores?.filter(score => score.category === categoryName).map(score => (
                              <div key={score.criterion_id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 flex-1">{score.question}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < score.score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
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
                        <Star key={i} className={`h-4 w-4 ${i < evaluation.technical_skills! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.communication && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communication:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < evaluation.communication! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.cultural_fit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cultural Fit:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < evaluation.cultural_fit! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.experience_relevance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience Relevance:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < evaluation.experience_relevance! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.overall_impression && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Impression:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < evaluation.overall_impression! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
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
    </ScrollArea>
  );
};
