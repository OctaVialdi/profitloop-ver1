
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { requestTrialExtension } from "@/services/subscriptionService";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { useOrganization } from "@/hooks/useOrganization";

const SubscriptionExtension = () => {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const [extensionReason, setExtensionReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user email on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setContactEmail(data.user.email);
      }
    };
    
    getUser();
  }, []);
  
  const handleTrialExtensionRequest = async () => {
    if (!extensionReason.trim()) {
      toast.error("Mohon berikan alasan untuk perpanjangan trial");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!organization?.id) throw new Error("Organization ID not found");
      
      // Track trial extension request
      subscriptionAnalyticsService.trackTrialExtensionRequested(extensionReason, organization.id);
      
      const success = await requestTrialExtension(
        organization.id, 
        extensionReason, 
        contactEmail
      );
      
      if (success) {
        toast.success("Permintaan perpanjangan trial berhasil dikirim!");
        navigate('/settings/subscription');
      }
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      toast.error("Gagal mengirim permintaan perpanjangan trial");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Minta Perpanjangan Trial</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Form Permintaan Perpanjangan</CardTitle>
            <CardDescription>
              Isi form berikut untuk meminta perpanjangan masa trial Anda
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="extension-reason" className="text-sm font-medium">
                Alasan Perpanjangan
              </label>
              <Textarea
                id="extension-reason"
                placeholder="Ceritakan mengapa Anda memerlukan perpanjangan trial..."
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email Kontak
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Email untuk dihubungi"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings/subscription')}
            >
              Kembali
            </Button>
            <Button 
              onClick={handleTrialExtensionRequest} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionExtension;
