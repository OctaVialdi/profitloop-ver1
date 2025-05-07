
/**
 * Utility functions for handling candidate evaluations
 */

import { 
  CandidateEvaluation, 
  EvaluationCriteriaScore 
} from "@/services/candidateService";

/**
 * Converts legacy evaluation fields to criteria-based format
 */
export const convertLegacyEvaluationToCriteria = (evaluation: CandidateEvaluation): EvaluationCriteriaScore[] => {
  const criteriaScores: EvaluationCriteriaScore[] = [];
  
  // Convert technical skills
  if (evaluation.technical_skills !== null && evaluation.technical_skills !== undefined) {
    criteriaScores.push({
      criterion_id: "legacy-technical",
      category_id: "legacy",
      score: evaluation.technical_skills,
      question: "Technical Skills",
      category: "Legacy Evaluation"
    });
  }
  
  // Convert communication
  if (evaluation.communication !== null && evaluation.communication !== undefined) {
    criteriaScores.push({
      criterion_id: "legacy-communication",
      category_id: "legacy",
      score: evaluation.communication,
      question: "Communication",
      category: "Legacy Evaluation"
    });
  }
  
  // Convert cultural fit
  if (evaluation.cultural_fit !== null && evaluation.cultural_fit !== undefined) {
    criteriaScores.push({
      criterion_id: "legacy-cultural",
      category_id: "legacy",
      score: evaluation.cultural_fit,
      question: "Cultural Fit",
      category: "Legacy Evaluation"
    });
  }
  
  // Convert experience relevance
  if (evaluation.experience_relevance !== null && evaluation.experience_relevance !== undefined) {
    criteriaScores.push({
      criterion_id: "legacy-experience",
      category_id: "legacy",
      score: evaluation.experience_relevance,
      question: "Experience Relevance",
      category: "Legacy Evaluation"
    });
  }
  
  // Convert overall impression
  if (evaluation.overall_impression !== null && evaluation.overall_impression !== undefined) {
    criteriaScores.push({
      criterion_id: "legacy-overall",
      category_id: "legacy",
      score: evaluation.overall_impression,
      question: "Overall Impression",
      category: "Legacy Evaluation"
    });
  }
  
  return criteriaScores;
};

/**
 * Ensures that an evaluation has criteria_scores data
 * by converting legacy format if needed
 */
export const ensureEvaluationHasCriteriaScores = (evaluation: CandidateEvaluation): CandidateEvaluation => {
  // If criteria scores is already valid, return as is
  if (evaluation.criteria_scores && Array.isArray(evaluation.criteria_scores) && evaluation.criteria_scores.length > 0) {
    return evaluation;
  }
  
  // Handle case where criteria_scores is an object but not an array
  if (evaluation.criteria_scores && 
      typeof evaluation.criteria_scores === 'object' && 
      !Array.isArray(evaluation.criteria_scores)) {
    try {
      // Try to convert from object representation to array
      const criteriaArray = Object.values(evaluation.criteria_scores);
      if (Array.isArray(criteriaArray) && criteriaArray.length > 0) {
        return {
          ...evaluation,
          criteria_scores: criteriaArray
        };
      }
    } catch (err) {
      console.error("Error processing non-array criteria_scores:", err);
    }
  }
  
  // If we reach here, either criteria_scores doesn't exist or couldn't be converted
  // So create criteria scores from legacy fields
  return {
    ...evaluation,
    criteria_scores: convertLegacyEvaluationToCriteria(evaluation)
  };
};

/**
 * Calculates the average score from criteria scores
 */
export const calculateAverageFromCriteria = (criteriaScores: EvaluationCriteriaScore[]): number => {
  if (!criteriaScores || criteriaScores.length === 0) return 0;
  
  const totalScore = criteriaScores.reduce((sum, criterion) => sum + criterion.score, 0);
  return parseFloat((totalScore / criteriaScores.length).toFixed(2));
};

/**
 * Groups criteria scores by category for better display
 */
export const groupCriteriaByCategory = (
  criteriaScores: EvaluationCriteriaScore[]
): Record<string, EvaluationCriteriaScore[]> => {
  return criteriaScores.reduce((grouped, score) => {
    const category = score.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(score);
    return grouped;
  }, {} as Record<string, EvaluationCriteriaScore[]>);
};

/**
 * Validates if the evaluation score makes sense
 */
export const validateEvaluationScore = (evaluation: CandidateEvaluation): boolean => {
  // Simple validation: Check if the score is within a reasonable range (1-5)
  if (evaluation.average_score < 1 || evaluation.average_score > 5) {
    return false;
  }

  // If there are criteria scores, check if they're consistent with the average
  if (evaluation.criteria_scores && evaluation.criteria_scores.length > 0) {
    const calculatedAverage = calculateAverageFromCriteria(evaluation.criteria_scores);
    
    // The calculated average should be close to the stored average (within 0.2 points)
    if (Math.abs(calculatedAverage - evaluation.average_score) > 0.2) {
      return false;
    }
  }

  return true;
};
