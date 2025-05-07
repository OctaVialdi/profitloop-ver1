
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CriterionScore } from "./EvaluationTypes";
import { EvaluationScoreDisplay } from "./EvaluationScoreDisplay";

interface CategoryCriteriaDisplayProps {
  categoryCriteria: Record<string, CriterionScore[]>;
  defaultOpenCategories?: string[];
}

export const CategoryCriteriaDisplay: React.FC<CategoryCriteriaDisplayProps> = ({
  categoryCriteria,
  defaultOpenCategories = []
}) => {
  const categories = Object.keys(categoryCriteria);
  
  if (categories.length === 0) {
    return (
      <div className="text-gray-500 italic p-4 text-center border rounded-md">
        No criteria ratings found
      </div>
    );
  }

  return (
    <Accordion 
      type="multiple" 
      defaultValue={defaultOpenCategories} 
      className="w-full"
    >
      {categories.map(categoryName => (
        <AccordionItem 
          key={categoryName} 
          value={categoryName} 
          className="border rounded-md mb-3"
        >
          <AccordionTrigger className="text-sm font-medium px-4 py-2 bg-gray-50 hover:bg-gray-100">
            {categoryName}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 border-t bg-white">
            <div className="space-y-4">
              {categoryCriteria[categoryName].map(criterion => (
                <div 
                  key={criterion.criterion_id} 
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <EvaluationScoreDisplay 
                    score={criterion.score}
                    criterion={criterion}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
