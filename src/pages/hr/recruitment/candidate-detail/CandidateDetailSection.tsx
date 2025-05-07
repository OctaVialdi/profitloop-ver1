
import React from "react";
import { useOutletContext } from "react-router-dom";
import { CandidateWithDetails } from "@/services/candidateService";
import { PersonalSection } from "@/components/hr/recruitment/candidate-detail/PersonalSection";
import { IdentityAddressSection } from "@/components/hr/recruitment/candidate-detail/IdentityAddressSection";
import { EducationSection } from "@/components/hr/recruitment/candidate-detail/EducationSection";
import { WorkExperienceSection } from "@/components/hr/recruitment/candidate-detail/WorkExperienceSection";
import { FamilySection } from "@/components/hr/recruitment/candidate-detail/FamilySection";
import { EvaluationSection } from "@/components/hr/recruitment/candidate-detail/EvaluationSection";
import { StatusSection } from "@/components/hr/recruitment/candidate-detail/StatusSection";

interface CandidateDetailSectionProps {
  section: string;
}

type CandidateDetailContext = {
  candidate: CandidateWithDetails;
  onStatusUpdated: () => void;
};

export default function CandidateDetailSection({ section }: CandidateDetailSectionProps) {
  const { candidate, onStatusUpdated } = useOutletContext<CandidateDetailContext>();

  switch (section) {
    case "personal":
      return (
        <div className="space-y-6">
          <StatusSection candidate={candidate} onStatusUpdated={onStatusUpdated} />
          <PersonalSection candidate={candidate} />
          <IdentityAddressSection candidate={candidate} />
        </div>
      );

    case "education":
      return <EducationSection candidate={candidate} />;

    case "work":
      return <WorkExperienceSection candidate={candidate} />;

    case "family":
      return <FamilySection candidate={candidate} />;

    case "evaluation":
      return <EvaluationSection candidate={candidate} onEvaluationSubmitted={onStatusUpdated} />;

    default:
      return <div>Select a section to view details</div>;
  }
}
