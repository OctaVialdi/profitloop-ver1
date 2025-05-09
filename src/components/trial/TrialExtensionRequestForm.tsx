
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { requestTrialExtension } from '@/services/subscriptionService';
import { Label } from '@/components/ui/label';

interface TrialExtensionRequestFormProps {
  organizationId: string;
  userEmail: string; 
  onSuccess: () => void;
  onCancel: () => void;
}

const TrialExtensionRequestForm = ({
  organizationId,
  userEmail,
  onSuccess,
  onCancel
}: TrialExtensionRequestFormProps) => {
  const [reason, setReason] = useState('');
  const [contactEmail, setContactEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
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
        onSuccess();
      }
    } catch (error) {
      console.error('Error requesting trial extension:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Alasan Permintaan Perpanjangan</Label>
        <Textarea
          id="reason"
          placeholder="Jelaskan mengapa Anda membutuhkan perpanjangan trial..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Kontak</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email yang dapat dihubungi"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !reason.trim()}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
        </Button>
      </div>
    </form>
  );
};

export default TrialExtensionRequestForm;
