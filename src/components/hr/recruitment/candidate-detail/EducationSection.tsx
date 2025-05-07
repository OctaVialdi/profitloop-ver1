
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails, candidateService, CandidateFormalEducation, CandidateInformalEducation } from "@/services/candidateService";
import { School, BookOpen } from "lucide-react";
import { formatDate } from "@/utils/formatUtils";

interface EducationSectionProps {
  candidate: CandidateWithDetails;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  candidate
}) => {
  const [educationData, setEducationData] = useState<{
    formalEducation: CandidateFormalEducation[],
    informalEducation: CandidateInformalEducation[]
  }>({
    formalEducation: candidate.formalEducation || [],
    informalEducation: candidate.informalEducation || []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced debug logging to verify the data we're receiving
  console.log("EducationSection: Rendering with candidate ID:", candidate.id);
  console.log("EducationSection: Candidate full data:", candidate);
  console.log("EducationSection: Formal education data:", candidate.formalEducation);
  console.log("EducationSection: Informal education data:", candidate.informalEducation);

  useEffect(() => {
    // Jika data pendidikan tidak tersedia, fetch langsung dari database
    const fetchEducationDataIfNeeded = async () => {
      const hasFormalEducation = Array.isArray(candidate.formalEducation) && candidate.formalEducation.length > 0;
      const hasInformalEducation = Array.isArray(candidate.informalEducation) && candidate.informalEducation.length > 0;
      
      // Hanya fetch jika kedua data tidak tersedia
      if (!hasFormalEducation && !hasInformalEducation) {
        console.log("EducationSection: Education data missing, fetching directly from database");
        setIsLoading(true);
        
        try {
          const directEducationData = await candidateService.fetchCandidateEducation(candidate.id);
          console.log("EducationSection: Directly fetched education data:", directEducationData);
          
          setEducationData(directEducationData);
        } catch (error) {
          console.error("Failed to fetch education data directly:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchEducationDataIfNeeded();
  }, [candidate.id, candidate.formalEducation, candidate.informalEducation]);
  
  // Better validation to ensure we have arrays for education data
  const formalEducation = educationData.formalEducation || [];
  const informalEducation = educationData.informalEducation || [];
  
  console.log("EducationSection: Final formal education count:", formalEducation.length);
  console.log("EducationSection: Final informal education count:", informalEducation.length);
  
  const hasFormalEducation = formalEducation.length > 0;
  const hasInformalEducation = informalEducation.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-100 rounded-md"></div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-100 rounded-md"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
