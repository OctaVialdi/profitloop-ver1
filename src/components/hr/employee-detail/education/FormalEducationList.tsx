
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { FormalEducation } from '@/services/educationService';
import { School } from "lucide-react";

interface FormalEducationListProps {
  educationList: FormalEducation[];
}

export const FormalEducationList: React.FC<FormalEducationListProps> = ({ educationList }) => {
  if (!educationList || educationList.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {educationList.map((education) => (
        <Card key={education.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-primary/10 p-4 flex items-center justify-center md:w-16">
                <School className="h-8 w-8 text-primary" />
              </div>
              <div className="p-4 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{education.institution_name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm font-medium">Degree:</span> {education.degree}
                  </div>
                  <div>
                    <span className="text-sm font-medium">Field of Study:</span> {education.field_of_study}
                  </div>
                  {education.grade && (
                    <div>
                      <span className="text-sm font-medium">Grade/GPA:</span> {education.grade}
                    </div>
                  )}
                </div>
                
                {education.description && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm mt-1">{education.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
