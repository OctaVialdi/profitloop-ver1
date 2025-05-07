
import React from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { School, BookOpen } from "lucide-react";
import { formatDate } from "@/utils/formatUtils";

interface EducationSectionProps {
  candidate: CandidateWithDetails;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  candidate
}) => {
  // Enhanced debug logging to verify the data we're receiving
  console.log("EducationSection: Rendering with candidate ID:", candidate.id);
  console.log("EducationSection: Candidate full data:", candidate);
  console.log("EducationSection: Formal education data:", candidate.formalEducation);
  console.log("EducationSection: Informal education data:", candidate.informalEducation);

  // Better validation to ensure we have arrays for education data
  const formalEducation = candidate.formalEducation || [];
  const informalEducation = candidate.informalEducation || [];
  
  console.log("EducationSection: Formal education count:", formalEducation.length);
  console.log("EducationSection: Informal education count:", informalEducation.length);
  
  const hasFormalEducation = formalEducation.length > 0;
  const hasInformalEducation = informalEducation.length > 0;

  return (
    <div className="space-y-6">
      {/* Formal Education Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <School className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Formal Education</h2>
          </div>
          
          {hasFormalEducation ? (
            <div className="space-y-4">
              {formalEducation.map((education) => (
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

      {/* Informal Education Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Informal Education</h2>
          </div>
          
          {hasInformalEducation ? (
            <div className="space-y-4">
              {informalEducation.map((education) => (
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
