
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkExperience } from '@/services/educationService';
import { GraduationCap, Edit, Trash2 } from "lucide-react";
import { EditWorkExperienceDialog } from '../edit/EditWorkExperienceDialog';
import { DeleteWorkExperienceDialog } from '../edit/DeleteWorkExperienceDialog';

interface WorkExperienceListProps {
  experienceList: WorkExperience[];
  onExperienceUpdated: () => void;
}

export const WorkExperienceList: React.FC<WorkExperienceListProps> = ({ 
  experienceList,
  onExperienceUpdated
}) => {
  const [editExperience, setEditExperience] = useState<WorkExperience | null>(null);
  const [deleteExperience, setDeleteExperience] = useState<WorkExperience | null>(null);

  if (!experienceList || experienceList.length === 0) {
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
    <>
      <div className="space-y-4">
        {experienceList.map((experience) => (
          <Card key={experience.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/10 p-4 flex items-center justify-center md:w-16">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{experience.company_name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => setEditExperience(experience)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => setDeleteExperience(experience)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Position:</span> {experience.position}
                    </div>
                    {experience.location && (
                      <div>
                        <span className="text-sm font-medium">Location:</span> {experience.location}
                      </div>
                    )}
                  </div>
                  
                  {experience.job_description && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Job Description:</span>
                      <p className="text-sm mt-1">{experience.job_description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Experience Dialog */}
      {editExperience && (
        <EditWorkExperienceDialog
          open={!!editExperience}
          experience={editExperience}
          onOpenChange={(open) => {
            if (!open) setEditExperience(null);
          }}
          onSuccess={onExperienceUpdated}
        />
      )}

      {/* Delete Experience Dialog */}
      {deleteExperience && (
        <DeleteWorkExperienceDialog
          open={!!deleteExperience}
          experience={deleteExperience}
          onOpenChange={(open) => {
            if (!open) setDeleteExperience(null);
          }}
          onSuccess={onExperienceUpdated}
        />
      )}
    </>
  );
};
