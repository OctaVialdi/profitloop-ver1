
import React, { useState } from "react";
import { CandidateWithDetails } from "@/services/candidateService";
import { CandidateDetailSidebar } from "./CandidateDetailSidebar";
import { PersonalSection } from "./PersonalSection";
import { IdentityAddressSection } from "./IdentityAddressSection";
import { EducationSection } from "./EducationSection";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { FamilySection } from "./FamilySection";
import { StatusSection } from "./StatusSection";
import { EvaluationSection } from "./EvaluationSection";

interface CandidateDetailProps {
  candidate: CandidateWithDetails;
  onStatusUpdated: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onStatusUpdated
}) => {
  const [activeTab, setActiveTab] = useState("personal");

  // Render content for each section based on activeTab
  const renderSectionContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <StatusSection candidate={candidate} onStatusUpdated={onStatusUpdated} />
            <PersonalSection candidate={candidate} />
            <IdentityAddressSection candidate={candidate} />
          </div>
        );
        
      case 'education':
        return <EducationSection candidate={candidate} />;
        
      case 'work':
        return <WorkExperienceSection candidate={candidate} />;
        
      case 'family':
        return <FamilySection candidate={candidate} />;
        
      case 'evaluation':
        return <EvaluationSection candidate={candidate} onEvaluationSubmitted={onStatusUpdated} />;
        
      default:
        return <div>Select a section to view details</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left sidebar with profile picture and navigation */}
      <CandidateDetailSidebar 
        candidate={candidate} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Main content area */}
      <div className="flex-1">
        {renderSectionContent()}
      </div>
    </div>
  );
};
