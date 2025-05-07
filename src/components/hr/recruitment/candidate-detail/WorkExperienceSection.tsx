
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";

interface WorkExperienceSectionProps {
  candidate: CandidateWithDetails;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  candidate
}) => {
  const hasWorkExperience = candidate.workExperience && candidate.workExperience.length > 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Work Experience</h2>
        </div>
        
        {hasWorkExperience ? (
          <div className="space-y-4">
            {candidate.workExperience!.map((experience, index) => (
              <div key={experience.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{experience.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : "Present"}
                  </span>
                </div>
                <p className="text-gray-700">{experience.company_name}</p>
                {experience.location && (
                  <p className="text-sm text-gray-600 mt-1">{experience.location}</p>
                )}
                {experience.job_description && (
                  <p className="text-sm mt-2">{experience.job_description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md">
            <p className="text-gray-500">No work experience data provided</p>
          </div>
        )}
      </div>
    </Card>
  );
};
