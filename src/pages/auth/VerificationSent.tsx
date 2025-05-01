import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmailTips from '@/components/auth/EmailTips';
import { supabase } from '@/integrations/supabase/client';

const VerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const isInvitation = location.state?.isInvitation || false;
  const invitationToken = location.state?.invitationToken || "";
  const organizationName = location.state?.organizationName || "";
  const role = location.state?.role || "";
  
  useEffect(() => {
    if (!email) {
      navigate('/auth/login');
      return;
    }
    
    // Listen for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // If user has signed in
        toast.success("Email verified successfully");
        
        // Process invitation if present
        if (invitationToken) {
          handleInvitationAcceptance(session?.user.id);
        } else {
          // Normal sign in, redirect to dashboard or onboarding
          navigate('/dashboard');
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [email, navigate, invitationToken]);
  
  const handleInvitationAcceptance = async (userId: string | undefined) => {
    if (!userId || !invitationToken) return;
    
    try {
      // Process the magic link invitation
      const { data, error } = await supabase.rpc(
        'process_magic_link_invitation',
        {
          invitation_token: invitationToken,
          user_id: userId
        }
      );
      
      if (error) throw error;
      
      if (data.success) {
        toast.success("Successfully joined organization");
        // Navigate to employee welcome page with organization info
        navigate("/employee-welcome", { 
          state: { 
            organizationName, 
            role 
          }
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Failed to join organization");
      navigate("/dashboard");
    }
  };
  
  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) throw error;
      
      toast.success("Verification email resent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    }
  };
  
  const handleLogin = async () => {
    if (!password) {
      navigate('/auth/login');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <MailCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {invitationToken ? "Magic Link Sent" : "Check your email"}
          </CardTitle>
          <CardDescription className="text-center">
            {invitationToken ? (
              <>A magic link has been sent to <strong>{email}</strong>. Click the link in the email to join the organization.</>
            ) : (
              <>We've sent a verification link to <strong>{email}</strong>. Please click the link to verify your email address.</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmailTips />
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
            >
              Resend Email
            </Button>
            
            {password && !invitationToken && (
              <Button onClick={handleLogin}>
                Try to Log In
              </Button>
            )}
            
            <Button 
              variant="link" 
              onClick={() => navigate('/auth/login')}
            >
              Use a different email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSent;
