
import React from "react";
import { FormStep } from "./FormSteps";

interface ProgressStepsProps {
  currentStep: FormStep;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      <div className={`flex flex-col items-center ${currentStep >= FormStep.PERSONAL_DATA ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.PERSONAL_DATA ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
          {currentStep > FormStep.PERSONAL_DATA ? "✓" : "1"}
        </div>
        <span className="text-sm mt-1">Personal data</span>
      </div>
      
      <div className="flex-grow h-px bg-gray-200 mx-2"></div>
      
      <div className={`flex flex-col items-center ${currentStep >= FormStep.EMPLOYMENT_DATA ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.EMPLOYMENT_DATA ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
          2
        </div>
        <span className="text-sm mt-1">Employment data</span>
      </div>
      
      <div className="flex-grow h-px bg-gray-200 mx-2"></div>
      
      <div className={`flex flex-col items-center ${currentStep >= FormStep.PAYROLL ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.PAYROLL ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
          3
        </div>
        <span className="text-sm mt-1">Payroll</span>
      </div>
      
      <div className="flex-grow h-px bg-gray-200 mx-2"></div>
      
      <div className={`flex flex-col items-center ${currentStep >= FormStep.INVITE ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= FormStep.INVITE ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
          4
        </div>
        <span className="text-sm mt-1">Invite employee</span>
      </div>
    </div>
  );
};
