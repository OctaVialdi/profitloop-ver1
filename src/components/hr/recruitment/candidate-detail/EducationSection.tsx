
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";

interface EducationSectionProps {
  candidate: CandidateWithDetails;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  candidate
}) => {
  const hasFormalEducation = candidate.formalEducation && candidate.formalEducation.length > 0;
  const hasInformalEducation = candidate.informalEducation && candidate.informalEducation.length > 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Formal Education</h2>
          </div>
          
          {hasFormalEducation ? (
            <div className="space-y-4">
              {candidate.formalEducation!.map((education, index) => (
                <div key={education.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{education.institution_name}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(education.start_date)} - {formatDate(education.end_date)}
                    </span>
                  </div>
                  <p className="text-gray-700">{education.degree} - {education.field_of_study}</p>
                  {education.grade && (
                    <p className="text-sm text-gray-600 mt-1">Grade: {education.grade}</p>
                  )}
                  {education.description && (
                    <p className="text-sm mt-2">{education.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-md">
              <p className="text-gray-500">No formal education data provided</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Informal Education</h2>
          </div>
          
          {hasInformalEducation ? (
            <div className="space-y-4">
              {candidate.informalEducation!.map((education, index) => (
                <div key={education.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{education.course_name}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(education.start_date)} - {formatDate(education.end_date)}
                    </span>
                  </div>
                  <p className="text-gray-700">{education.provider} - {education.certification_field}</p>
                  {education.certificate_number && (
                    <p className="text-sm text-gray-600 mt-1">Certificate #: {education.certificate_number}</p>
                  )}
                  {education.description && (
                    <p className="text-sm mt-2">{education.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-md">
              <p className="text-gray-500">No informal education data provided</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
