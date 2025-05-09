
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { requestTrialExtension } from "@/services/subscriptionService";

interface TrialExtensionRequestFormProps {
  organizationId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  userEmail?: string;
}

const TrialExtensionRequestForm = ({ 
  organizationId, 
  onSuccess, 
  onCancel,
  userEmail = '' 
}: TrialExtensionRequestFormProps) => {
  const [reason, setReason] = useState('');
  const [contactEmail, setContactEmail] = useState(userEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error('Please provide a reason for your trial extension request');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await requestTrialExtension(
        organizationId,
        reason,
        contactEmail
      );
      
      if (success) {
        toast.success('Your trial extension request has been submitted. We\'ll contact you soon.');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error requesting trial extension:', error);
      toast.error('Failed to submit trial extension request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium">
          Why do you need a trial extension?
        </label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain why you need more time with our trial..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contactEmail" className="block text-sm font-medium">
          Contact Email
        </label>
        <Input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Email where we can reach you"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default TrialExtensionRequestForm;
