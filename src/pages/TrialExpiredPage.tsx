
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sparkles, ArrowRight, Clock, Send, Info } from "lucide-react";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { useOrganization } from "@/hooks/useOrganization";
import { robustSignOut } from "@/utils/authUtils";
import { requestTrialExtension } from "@/services/subscriptionService";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TrialExpiredPage = () => {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [extensionReason, setExtensionReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle subscription navigation
  const handleUpgrade = () => {
    subscriptionAnalyticsService.trackEvent({
      eventType: 'trial_banner_clicked',
      organizationId: organization?.id,
      additionalData: { 
        action: 'navigate_to_subscription',
        source: 'expired_page'
      }
    });
    navigate("/settings/subscription");
  };

  // Handle sign out
  const handleSignOut = async () => {
    await robustSignOut();
    navigate("/auth/login");
  };

  // Handle trial extension request
  const handleExtensionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!extensionReason.trim()) {
      toast.error("Please provide a reason for your extension request");
      return;
    }

    if (!contactEmail.trim()) {
      toast.error("Please provide a contact email");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (organization?.id) {
        await requestTrialExtension(
          organization.id,
          extensionReason,
          contactEmail
        );
        
        subscriptionAnalyticsService.trackEvent({
          eventType: 'trial_extension_requested',
          organizationId: organization.id,
          additionalData: {
            reason: extensionReason,
            contact: contactEmail
          }
        });
        
        setShowExtensionForm(false);
        setExtensionReason("");
        setContactEmail("");
        toast.success("Your trial extension request has been submitted. We'll contact you soon.");
      } else {
        toast.error("Could not identify your organization. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Error requesting extension:", error);
      toast.error("Failed to submit extension request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left side - Content */}
              <div className="flex-1 p-6 md:p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Your trial period has ended
                    </h1>
                  </div>

                  <p className="text-gray-600">
                    Thank you for trying our platform. To continue using all features and services, 
                    please upgrade to one of our premium plans.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 text-sm">
                          Your account is currently limited. Upgrade now to regain access to all features
                          and continue working with your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!showExtensionForm ? (
                    <div className="space-y-4">
                      <Button 
                        onClick={handleUpgrade} 
                        className="w-full py-6 text-lg bg-[#9b87f5] hover:bg-[#8a72f3]"
                      >
                        Upgrade Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 py-6" 
                          onClick={() => setShowExtensionForm(true)}
                        >
                          Request Trial Extension
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="flex-1 py-6" 
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleExtensionRequest} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                          Why do you need an extension?
                        </label>
                        <Textarea
                          id="reason"
                          value={extensionReason}
                          onChange={(e) => setExtensionReason(e.target.value)}
                          placeholder="Please explain why you need more time with the trial..."
                          className="w-full h-32"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          type="submit" 
                          className="flex-1 py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Request"}
                          <Send className="ml-2 w-4 h-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1 py-6" 
                          onClick={() => setShowExtensionForm(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Right side - Benefits */}
              <div className="bg-blue-50 p-6 md:p-8 md:w-1/3 border-t md:border-t-0 md:border-l border-blue-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-800">Premium Benefits</h2>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                        <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Unlimited access to all features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                        <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                        <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Advanced analytics and reporting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                        <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Team collaboration tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                        <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Custom integrations</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">
                      Join thousands of businesses that trust our platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrialExpiredPage;
