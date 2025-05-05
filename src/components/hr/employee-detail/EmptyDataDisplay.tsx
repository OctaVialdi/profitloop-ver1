import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, School, GraduationCap, BookPlus } from 'lucide-react';
import { AddFormalEducationDialog } from './edit/AddFormalEducationDialog';

interface EmptyDataDisplayProps {
  title: string;
  description: string;
  section: string;
  handleEdit: (section: string) => void;
  buttonText?: string;  // Make buttonText optional
  onClick?: () => void; // Add optional onClick handler
}

export const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({
  title,
  description,
  section,
  handleEdit,
  buttonText, // Include the new prop
  onClick,   // Include the new prop
}) => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState<string | undefined>();
  
  // Extract employee ID from URL if available
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setEmployeeId(id);
    }
  }, []);

  const renderIcon = () => {
    switch (section) {
      case 'formal-education':
        return <School className="h-12 w-12 text-muted-foreground/50" />;
      case 'informal-education':
        return <BookPlus className="h-12 w-12 text-muted-foreground/50" />;
      case 'working-experience':
        return <GraduationCap className="h-12 w-12 text-muted-foreground/50" />;
      default:
        return <School className="h-12 w-12 text-muted-foreground/50" />;
    }
  };

  const handleAddButtonClick = () => {
    // If there's an onClick handler passed as a prop, use it
    if (onClick) {
      onClick();
      return;
    }

    // Otherwise use the default behavior
    if (section === 'formal-education' && employeeId) {
      setAddDialogOpen(true);
    } else {
      handleEdit(section);
    }
  };

  const handleAddSuccess = () => {
    // Force page reload to reflect new data
    window.location.reload();
  };

  return (
    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 mt-4">
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        {renderIcon()}
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="mt-6 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleAddButtonClick}
          >
            <Plus className="h-4 w-4" /> {buttonText || "Add Education"}
          </Button>
        </div>
      </div>

      {/* Formal Education Add Dialog */}
      {section === 'formal-education' && employeeId && (
        <AddFormalEducationDialog
          open={addDialogOpen}
          employeeId={employeeId}
          onOpenChange={setAddDialogOpen}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};
