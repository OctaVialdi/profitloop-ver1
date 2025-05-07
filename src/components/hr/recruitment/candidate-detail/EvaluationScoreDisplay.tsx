
import React from "react";
import { Star } from "lucide-react";
import { CriterionScore } from "./EvaluationTypes";

interface EvaluationScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  fillColor?: string;
  criterion?: CriterionScore;
}

export const EvaluationScoreDisplay: React.FC<EvaluationScoreDisplayProps> = ({
  score,
  maxScore = 5,
  size = "md",
  showNumber = true,
  fillColor = "text-yellow-400 fill-yellow-400",
  criterion
}) => {
  // Size mappings
  const sizeMap = {
    sm: { star: "h-3 w-3", text: "text-xs" },
    md: { star: "h-5 w-5", text: "text-sm" },
    lg: { star: "h-6 w-6", text: "text-base" }
  };

  // Ensure score is valid
  const validScore = Math.min(Math.max(0, score), maxScore);
  
  return (
    <div className="flex flex-col">
      {criterion && (
        <div className="flex justify-between mb-1">
          <span className={`font-medium ${sizeMap[size].text}`}>{criterion.question}</span>
          {showNumber && (
            <span className={`${sizeMap[size].text} font-medium bg-gray-100 px-2 py-0.5 rounded`}>
              {validScore.toFixed(1)}/{maxScore}
            </span>
          )}
        </div>
      )}
      <div className="flex">
        {[...Array(maxScore)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeMap[size].star} ${
              i < validScore ? fillColor : "text-gray-300"
            }`}
          />
        ))}
        {showNumber && !criterion && (
          <span className={`ml-2 ${sizeMap[size].text} font-semibold`}>
            {validScore.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
};
