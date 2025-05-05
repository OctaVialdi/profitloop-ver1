
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InformalEducation } from '@/services/educationService';
import { BookPlus, Edit, Trash2 } from "lucide-react";
import { EditInformalEducationDialog } from '../edit/EditInformalEducationDialog';
import { DeleteInformalEducationDialog } from '../edit/DeleteInformalEducationDialog';

interface InformalEducationListProps {
  educationList: InformalEducation[];
  onEducationUpdated: () => void;
}

export const InformalEducationList: React.FC<InformalEducationListProps> = ({ 
  educationList,
  onEducationUpdated
}) => {
  const [editEducation, setEditEducation] = useState<InformalEducation | null>(null);
  const [deleteEducation, setDeleteEducation] = useState<InformalEducation | null>(null);

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
    <>
      <div className="space-y-4">
        {educationList.map((education) => (
          <Card key={education.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/10 p-4 flex items-center justify-center md:w-16">
                  <BookPlus className="h-8 w-8 text-primary" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{education.course_name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(education.start_date)} - {formatDate(education.end_date)}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => setEditEducation(education)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => setDeleteEducation(education)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Provider:</span> {education.provider}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Certification Field:</span> {education.certification_field}
                    </div>
                    {education.certificate_number && (
                      <div>
                        <span className="text-sm font-medium">Certificate Number:</span> {education.certificate_number}
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

      {/* Edit Education Dialog */}
      {editEducation && (
        <EditInformalEducationDialog
          open={!!editEducation}
          education={editEducation}
          onOpenChange={(open) => {
            if (!open) setEditEducation(null);
          }}
          onSuccess={onEducationUpdated}
        />
      )}

      {/* Delete Education Dialog */}
      {deleteEducation && (
        <DeleteInformalEducationDialog
          open={!!deleteEducation}
          education={deleteEducation}
          onOpenChange={(open) => {
            if (!open) setDeleteEducation(null);
          }}
          onSuccess={onEducationUpdated}
        />
      )}
    </>
  );
};
