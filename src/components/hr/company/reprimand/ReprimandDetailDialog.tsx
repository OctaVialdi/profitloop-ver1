
import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Eye, FileText, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Reprimand } from '@/services/reprimandService';

interface ReprimandDetailDialogProps {
  reprimand: Reprimand | null;
  isOpen: boolean; 
  onClose: () => void;
}

const ReprimandDetailDialog: React.FC<ReprimandDetailDialogProps> = ({
  reprimand,
  isOpen,
  onClose,
}) => {
  if (!reprimand) return null;

  const handleDownload = (url: string, fileName: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Reprimand Details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Employee</p>
              <p className="text-base">{reprimand.employee_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="text-base">{reprimand.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-base">{reprimand.reprimand_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-base">{format(new Date(reprimand.date), 'PPP')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge 
                variant={
                  reprimand.status === 'Active' ? 'default' : 
                  reprimand.status === 'Resolved' ? 'outline' : 'secondary'
                }
              >
                {reprimand.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Escalation Level</p>
              <p className="text-base">Level {reprimand.escalation_level}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Details</p>
            <div className="bg-muted p-4 rounded-md min-h-[100px] whitespace-pre-wrap">
              {reprimand.details || "No details provided."}
            </div>
          </div>

          {reprimand.evidence_attachments && reprimand.evidence_attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Evidence Attachments</p>
                <div className="space-y-2">
                  {reprimand.evidence_attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-muted p-3 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => window.open(attachment.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(attachment.url, attachment.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Created: {format(new Date(reprimand.created_at), 'PPP p')}</p>
            <p>Last updated: {format(new Date(reprimand.updated_at), 'PPP p')}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReprimandDetailDialog;
