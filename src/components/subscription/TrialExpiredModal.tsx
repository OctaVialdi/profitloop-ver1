
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUpgrade?: () => void;
  onRequest?: () => void;
  allowClose?: boolean;
  organizationName?: string;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onRequest,
  allowClose = false,
  organizationName = "your organization"
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription');
    }
  };

  const handleRequestExtension = () => {
    if (onRequest) {
      onRequest();
    } else {
      navigate('/settings/subscription/request-extension');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={allowClose ? onClose : undefined}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl text-center">Trial Period Expired</DialogTitle>
          <DialogDescription className="text-center">
            Your trial period for {organizationName} has ended. To continue using all features,
            please upgrade to one of our subscription plans.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Upgrading provides you with continued access to all features and premium support.
            You can also request a trial extension if you need more time to evaluate.
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade Now
          </Button>
          <Button onClick={handleRequestExtension} variant="outline" className="w-full">
            Request Trial Extension
          </Button>
          {allowClose && (
            <Button onClick={onClose} variant="ghost" className="w-full">
              I'll Decide Later
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
