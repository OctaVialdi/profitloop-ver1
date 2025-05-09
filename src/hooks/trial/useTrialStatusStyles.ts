
import { daysLeftInTrialType } from "@/types/trial";

interface TrialStatusStyles {
  containerClass: string;
  titleClass: string;
  progressClass: string;
  buttonVariant: 'default' | 'destructive' | 'warning';
}

export function useTrialStatusStyles(isTrialActive: boolean, daysLeftInTrial: daysLeftInTrialType): TrialStatusStyles {
  if (!isTrialActive) {
    return {
      containerClass: 'border-red-200 bg-red-50',
      titleClass: 'text-red-800',
      progressClass: 'bg-red-500',
      buttonVariant: 'destructive'
    };
  }
  
  if (daysLeftInTrial <= 3) {
    return {
      containerClass: 'border-amber-200 bg-amber-50',
      titleClass: 'text-amber-800',
      progressClass: 'bg-amber-500',
      buttonVariant: 'warning'
    };
  }
  
  return {
    containerClass: 'border-blue-200 bg-blue-50',
    titleClass: 'text-blue-800',
    progressClass: 'bg-blue-500',
    buttonVariant: 'default'
  };
}
