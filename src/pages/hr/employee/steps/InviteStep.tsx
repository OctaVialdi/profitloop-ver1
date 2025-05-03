
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Copy, Sparkles, Mail } from "lucide-react";

export const InviteStep: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkUrl, setMagicLinkUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get user's organization ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be logged in to send invitations");
        setIsLoading(false);
        return;
      }
      
      // Get user's profile to find organization ID
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        toast.error("You are not associated with an organization");
        setIsLoading(false);
        return;
      }
      
      // Generate magic link using edge function
      const response = await supabase.functions.invoke('send-magic-link', {
        body: { 
          email, 
          organizationId: profileData.organization_id,
          role 
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to create magic link");
      }
      
      const data = response.data;
      
      // Set the magic link URL for display
      if (data.invitation_url) {
        setMagicLinkUrl(data.invitation_url);
      }

      // Show appropriate message based on email sending result
      if (data.email_sent) {
        toast.success(`Magic Link has been sent to ${email}`);
      } else {
        toast.warning("Email couldn't be sent, but you can copy the Magic Link manually");
      }
      
      setEmail("");
      
    } catch (error: any) {
      console.error("Magic Link error:", error);
      toast.error(error.message || "Failed to send Magic Link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        
        // Reset the copied status after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link");
      }
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Invite employee</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <CardTitle>Invite via Magic Link</CardTitle>
          </div>
          <CardDescription>
            Send a Magic Link invitation that allows employees to join without creating a password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? "Sending..." : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
          
          {magicLinkUrl && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="font-medium text-blue-700 mb-2">Magic Link Ready</p>
              <div className="p-3 bg-white rounded border border-blue-100 flex items-start">
                <div className="flex-1 overflow-auto text-sm">
                  {magicLinkUrl}
                </div>
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 flex-shrink-0" 
                  onClick={() => copyToClipboard(magicLinkUrl)}
                >
                  <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
                </Button>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Copy this link to share with {email} or check if the email was sent successfully.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
