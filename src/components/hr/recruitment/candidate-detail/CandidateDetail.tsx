
import React from "react";
import { CandidateWithDetails } from "@/services/candidateService";
import { CandidateDetailSidebar } from "./CandidateDetailSidebar";
import { Outlet } from "react-router-dom";

interface CandidateDetailProps {
  candidate: CandidateWithDetails;
  onStatusUpdated: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onStatusUpdated
}) => {
  // Add debug logging
  console.log("CandidateDetail: Rendering with candidate data:", candidate);
  console.log("CandidateDetail: Education data:", {
    formal: candidate.formalEducation,
    informal: candidate.informalEducation
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left sidebar with profile picture and navigation */}
      <CandidateDetailSidebar candidate={candidate} />

      {/* Main content area - render the nested route content */}
      <div className="flex-1">
        <Outlet context={{ candidate, onStatusUpdated }} />
      </div>
    </div>
  );
};
