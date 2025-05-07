
/**
 * Type definitions for candidate evaluations
 * This helps to standardize the evaluation data structure across the application
 */

/**
 * Represents a single criterion score in an evaluation
 */
export interface CriterionScore {
  criterion_id: string;
  category_id: string;
  score: number;
  question: string; 
  category: string;
}

/**
 * Represents a grouped set of criterion scores by category
 */
export interface GroupedCriteriaScores {
  [categoryName: string]: CriterionScore[];
}

/**
 * Error type for evaluation validation
 */
export type EvaluationValidationError = {
  field: string;
  message: string;
};

/**
 * Status of an evaluation
 */
export enum EvaluationStatus {
  Valid = "valid",
  Warning = "warning",
  Error = "error"
}

/**
 * Evaluation validation result
 */
export interface EvaluationValidationResult {
  status: EvaluationStatus;
  errors: EvaluationValidationError[];
  warnings: EvaluationValidationError[];
}

/**
 * Represents a category of evaluation criteria from the database
 */
export interface EvaluationCategoryData {
  category_id: string;
  category_name: string;
  criteria: Array<{
    id: string;
    question: string;
  }>;
}
