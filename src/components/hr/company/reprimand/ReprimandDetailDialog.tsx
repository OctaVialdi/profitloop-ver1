
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reprimand } from '@/services/reprimandService';
import { format } from 'date-fns';
import { AlertTriangle, FileText, User, Calendar, ArrowUpRight } from 'lucide-react';

interface ReprimandDetailDialogProps {
  reprimand: Reprimand | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReprimandDetailDialog: React.FC<ReprimandDetailDialogProps> = ({
  reprimand,
  isOpen,
  onClose
}) => {
  if (!reprimand) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Active</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case 'Appealed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Appealed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'Verbal':
        return <Badge variant="outline">{type}</Badge>;
      case 'Written':
        return <Badge variant="secondary">{type}</Badge>;
      case 'PIP':
        return <Badge variant="default">{type}</Badge>;
      case 'Final Warning':
        return <Badge variant="destructive">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Reprimand Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderTypeBadge(reprimand.reprimand_type)}
              {reprimand.escalation_level > 1 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  Level {reprimand.escalation_level}
                </Badge>
              )}
            </div>
            {renderStatusBadge(reprimand.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <User className="h-3 w-3" /> Employee
              </div>
              <div className="font-medium">{reprimand.employee_name}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> Department
              </div>
              <div className="font-medium">{reprimand.department}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date
              </div>
              <div className="font-medium">{format(new Date(reprimand.date), 'MMMM d, yyyy')}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <FileText className="h-3 w-3" /> Created
              </div>
              <div className="font-medium">{format(new Date(reprimand.created_at), 'MMMM d, yyyy')}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Details</div>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {reprimand.details || 'No details provided.'}
            </div>
          </div>
          
          {reprimand.evidence_attachments && reprimand.evidence_attachments.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Evidence/Attachments</div>
              <div className="flex flex-wrap gap-2">
                {reprimand.evidence_attachments.map((attachment, index) => (
                  <a 
                    key={index} 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 border rounded hover:bg-gray-50 flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReprimandDetailDialog;
